<template>
  <div class="network-knowledge-map">
    <!-- 头部：标题 + 视图说明 + 控制按钮 -->
    <div class="nkm-header">
      <div class="nkm-title">
        <h3>计算机网络 · 知识体系地图</h3>
        <span class="nkm-sub">{{ nodes.length }} 个考点 · {{ edges.length }} 条关联 · 按分层与依赖串成一张网</span>
      </div>
      <div class="nkm-controls">
        <el-button size="small" :icon="ZoomIn" @click="zoomIn">放大</el-button>
        <el-button size="small" :icon="ZoomOut" @click="zoomOut">缩小</el-button>
        <el-button size="small" @click="resetView">重置</el-button>
        <el-button size="small" :icon="FullScreen" @click="toggleFullscreen">
          {{ isFullscreen ? '退出全屏' : '全屏' }}
        </el-button>
      </div>
    </div>

    <!-- 图例 -->
    <div class="nkm-legend">
      <span class="lg-item"><i class="lg-line lg-flow"></i>封装数据流（跨层传递）</span>
      <span class="lg-item"><i class="lg-line lg-dep"></i>依赖关系（A 需要 B）</span>
      <span class="lg-item"><i class="lg-line lg-rel"></i>关联对比</span>
      <span class="lg-item"><b>★</b>高频考点</span>
      <span class="lg-tip">悬停节点高亮相关连线 · 点击节点聚焦并跳转知识点</span>
    </div>

    <!-- 画布：外层可滚动，内层固定尺寸做缩放 -->
    <div class="nkm-viewport" ref="viewportRef">
      <div class="nkm-canvas" ref="canvasRef" :style="canvasStyle">
        <!-- 分层色带 + 左侧章节脊 -->
        <div
          v-for="(layer, li) in layers"
          :key="'band' + li"
          class="nkm-band"
          :style="bandStyle(li)"
        >
          <div class="nkm-band-spine" :style="{ borderLeftColor: layer.color }">
            <span class="spine-title">{{ layer.label }}</span>
            <span v-if="layer.score" class="spine-score">{{ layer.score }}</span>
            <span class="spine-count">{{ countInLayer(li) }} 个考点</span>
          </div>
        </div>

        <!-- 连线层 -->
        <svg class="nkm-edges" :width="CANVAS_W" :height="CANVAS_H">
          <defs>
            <marker id="nkm-arrow-flow" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto">
              <path d="M0,0 L9,4.5 L0,9 Z" fill="#f76707" />
            </marker>
            <marker id="nkm-arrow-dep" markerWidth="8" markerHeight="8" refX="6.5" refY="4" orient="auto">
              <path d="M0,0 L8,4 L0,8 Z" fill="#868e96" />
            </marker>
            <marker id="nkm-arrow-rel" markerWidth="8" markerHeight="8" refX="6.5" refY="4" orient="auto">
              <path d="M0,0 L8,4 L0,8 Z" fill="#4dabf7" />
            </marker>
          </defs>
          <path
            v-for="(e, ei) in layoutEdges"
            :key="'e' + ei"
            :d="e.d"
            class="nkm-edge"
            :class="[
              'edge-' + e.type,
              { active: isEdgeActive(e), dimmed: isEdgeDimmed(e) }
            ]"
            :marker-end="arrowFor(e.type)"
          />
        </svg>

        <!-- 节点层 -->
        <div
          v-for="n in layoutNodes"
          :key="n.id"
          class="nkm-node"
          :class="[
            { active: n.id === activeId, dimmed: isNodeDimmed(n), selected: n.id === selectedId, jumpable: !!n.sectionId },
            'star-' + (n.star || 0)
          ]"
          :style="nodeStyle(n)"
          @mouseenter="hoverId = n.id"
          @mouseleave="hoverId = ''"
          @click="selectNode(n)"
        >
          <span class="node-dot" :style="{ background: layerColor(n.layer) }"></span>
          <span class="node-label">{{ n.label }}</span>
          <span v-if="n.star === 3" class="node-star">★</span>
        </div>
      </div>

      <!-- 悬浮详情卡 -->
      <div v-if="selectedNode" class="nkm-detail">
        <div class="dt-head" :style="{ background: layerColor(selectedNode.layer) }">
          <span class="dt-layer">{{ selectedLayer.label }}</span>
          <span class="dt-close" @click="clearSelection">×</span>
        </div>
        <div class="dt-body">
          <div class="dt-name">
            {{ selectedNode.label }}
            <span v-if="selectedNode.star === 3" class="dt-star">高频 ★</span>
          </div>
          <p v-if="selectedNode.note" class="dt-note">{{ selectedNode.note }}</p>
          <div class="dt-links">
            <div v-if="relatedOf(selectedNode.id).length" class="dt-rel">
              <span class="rel-cap">相关考点</span>
              <span
                v-for="r in relatedOf(selectedNode.id)"
                :key="r.id"
                class="rel-chip"
                @click="focusById(r.id)"
              >{{ r.label }}</span>
            </div>
          </div>
          <el-button
            v-if="selectedNode.sectionId"
            type="primary"
            size="small"
            class="dt-jump"
            @click="jumpToSection(selectedNode)"
          >
            跳转到该知识点正文 →
          </el-button>
          <span v-else class="dt-nojump">该考点无独立正文小节</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useNetworkStore } from '@/stores/network'
import { ZoomIn, ZoomOut, FullScreen } from '@element-plus/icons-vue'

const networkStore = useNetworkStore()

/* ============ 布局常量 ============ */
const LEFT = 156      // 左侧章节脊宽度
const STEP = 142      // 同层节点横向间距
const NODE_W = 124
const NODE_H = 46
const BAND_TOP = 24
const BAND_H = 142

/* ============ 分层定义（脊标题尽量取自 store 章节） ============ */
interface LayerDef { key: string; label: string; chapterId?: string; color: string }
const layers: LayerDef[] = [
  { key: 'arch', label: '体系结构', chapterId: 'ch1', color: '#7048e8' },
  { key: 'phy', label: '物理层', chapterId: 'ch2', color: '#0ca678' },
  { key: 'dl', label: '数据链路层', chapterId: 'ch3', color: '#1c7ed6' },
  { key: 'net', label: '网络层', chapterId: 'ch4', color: '#e8590c' },
  { key: 'trans', label: '传输层', chapterId: 'ch5', color: '#d6336c' },
  { key: 'app', label: '应用层', chapterId: 'ch6', color: '#4263eb' },
  { key: 'sec', label: '安全 · 管理 · 新技术', chapterId: 'ch7', color: '#64707d' },
]

function chapterMeta(chapterId?: string) {
  if (!chapterId) return { title: '', score: '' }
  const ch = networkStore.chapters.find(c => c.id === chapterId)
  return { title: ch?.title || '', score: ch?.score || '' }
}
function layerScore(layer: LayerDef): string {
  return chapterMeta(layer.chapterId).score
}

/* ============ 节点原始定义（标签与 store / 408 考纲一致） ============ */
interface NodeDef {
  id: string
  label: string
  layer: number
  order: number
  sectionId?: string
  star?: number    // 3=高频
  note?: string
}
const nodes: NodeDef[] = [
  // —— 体系结构 ——
  { id: 'a_model', label: '五层参考模型', layer: 0, order: 0, sectionId: '1.2', star: 3, note: '物数网传会表应，贯穿整本计网的骨架' },
  { id: 'a_osi', label: 'OSI 七层', layer: 0, order: 1, sectionId: '1.2', star: 3 },
  { id: 'a_tcpip', label: 'TCP/IP 四层', layer: 0, order: 2, sectionId: '1.2', star: 2 },
  { id: 'a_pdu', label: '封装·PDU', layer: 0, order: 3, sectionId: '1.1', star: 3, note: '报文→段→分组→帧→比特，PDU=PCI+SDU' },
  { id: 'a_switch', label: '三种交换方式', layer: 0, order: 4, sectionId: '1.1', star: 3, note: '电路/报文/分组交换对比' },
  { id: 'a_perf', label: '时延·带宽', layer: 0, order: 5, sectionId: '1.1', star: 3, note: '发送时延 vs 传播时延、RTT' },
  { id: 'a_proto', label: '协议三要素', layer: 0, order: 6, sectionId: '1.1', star: 3, note: '语法·语义·时序' },

  // —— 物理层 ——
  { id: 'p_channel', label: '信道·信号·码元', layer: 1, order: 0, sectionId: '2.1', star: 2 },
  { id: 'p_nyq', label: '奈奎斯特定理', layer: 1, order: 1, sectionId: '2.1', star: 2, note: '无噪声极限 2W·log₂V' },
  { id: 'p_shannon', label: '香农定理', layer: 1, order: 2, sectionId: '2.1', star: 3, note: '有噪声极限 W·log₂(1+S/N)' },
  { id: 'p_encode', label: '编码与调制', layer: 1, order: 3, sectionId: '2.1', star: 2, note: '曼彻斯特/差分曼彻斯特/QAM' },
  { id: 'p_media', label: '传输介质', layer: 1, order: 4, sectionId: '2.2', star: 2, note: '双绞线/同轴/光纤/无线' },
  { id: 'p_hub', label: '中继器·集线器', layer: 1, order: 5, sectionId: '2.2', star: 1, note: '物理层设备，共享冲突域' },

  // —— 数据链路层 ——
  { id: 'd_frame', label: '封装成帧', layer: 2, order: 0, sectionId: '3.1', star: 2 },
  { id: 'd_transp', label: '透明传输·零比特填充', layer: 2, order: 1, sectionId: '3.1', star: 3 },
  { id: 'd_crc', label: '奇偶校验·CRC', layer: 2, order: 2, sectionId: '3.2', star: 3, note: '检错编码，模2除法' },
  { id: 'd_ham', label: '海明码', layer: 2, order: 3, sectionId: '3.2', star: 2, note: '纠错编码 2^r≥k+r+1' },
  { id: 'd_flow', label: '停等·GBN·SR', layer: 2, order: 4, sectionId: '3.3', star: 3, note: '滑动窗口与可靠传输' },
  { id: 'd_csma', label: 'CSMA/CD', layer: 2, order: 5, sectionId: '3.4', star: 3, note: '先听后发·边听边发·最小帧长' },
  { id: 'd_ppp', label: 'PPP', layer: 2, order: 6, star: 2, note: '点对点协议，广域网链路' },
  { id: 'd_eth', label: '以太网·MAC·802.3', layer: 2, order: 7, sectionId: '3.4', star: 3, note: '帧格式、MAC 地址' },
  { id: 'd_switch', label: '交换机', layer: 2, order: 8, star: 3, note: '链路层设备，按 MAC 转发，独立冲突域' },
  { id: 'd_wifi', label: '无线 802.11·CSMA/CA', layer: 2, order: 9, sectionId: '3.4', star: 2, note: '碰撞避免，RTS/CTS' },

  // —— 网络层 ——
  { id: 'n_ipv4', label: 'IP 数据报·IPv4', layer: 3, order: 0, sectionId: '4.3', star: 3, note: '首部字段、分片与重组' },
  { id: 'n_addr', label: 'IP 地址·分类', layer: 3, order: 1, sectionId: '4.3', star: 2, note: 'A/B/C/D/E 类' },
  { id: 'n_subnet', label: '子网划分', layer: 3, order: 2, sectionId: '4.3', star: 3, note: '借位、子网掩码' },
  { id: 'n_cidr', label: 'CIDR·路由聚合', layer: 3, order: 3, sectionId: '4.3', star: 3, note: '无分类编址、聚合缩小路由表' },
  { id: 'n_arp', label: 'ARP', layer: 3, order: 4, sectionId: '4.3', star: 3, note: 'IP→MAC，依赖 IP 与以太网' },
  { id: 'n_icmp', label: 'ICMP·ping', layer: 3, order: 5, sectionId: '4.3', star: 2 },
  { id: 'n_nat', label: 'NAT', layer: 3, order: 6, sectionId: '4.3', star: 3, note: '私有地址↔公有地址转换' },
  { id: 'n_ipv6', label: 'IPv6', layer: 3, order: 7, sectionId: '4.4', star: 2 },
  { id: 'n_rp', label: '路由协议 RIP/OSPF/BGP', layer: 3, order: 8, sectionId: '4.2', star: 3, note: '距离向量 vs 链路状态' },
  { id: 'n_router', label: '路由器', layer: 3, order: 9, sectionId: '4.1b', star: 3, note: '输入/交换/输出/路由处理器' },

  // —— 传输层 ——
  { id: 't_port', label: '端口·复用分用', layer: 4, order: 0, sectionId: '5.1', star: 2 },
  { id: 't_udp', label: 'UDP', layer: 4, order: 1, sectionId: '5.2', star: 2, note: '无连接、首部 8 字节' },
  { id: 't_tcp', label: 'TCP', layer: 4, order: 2, sectionId: '5.3', star: 3, note: '面向连接、可靠、字节流' },
  { id: 't_hand', label: '三次握手·四次挥手', layer: 4, order: 3, sectionId: '5.3', star: 3 },
  { id: 't_reliable', label: '可靠传输·超时重传', layer: 4, order: 4, sectionId: '5.3', star: 3 },
  { id: 't_flow', label: '流量控制·滑动窗口', layer: 4, order: 5, sectionId: '5.3', star: 3, note: '接收窗口 rwnd' },
  { id: 't_cong', label: '拥塞控制·慢开始', layer: 4, order: 6, sectionId: '5.3', star: 3, note: '慢开始/拥塞避免/快重传/快恢复' },

  // —— 应用层 ——
  { id: 'ap_model', label: 'C/S·P2P 模型', layer: 5, order: 0, sectionId: '6.1', star: 2 },
  { id: 'ap_dns', label: 'DNS', layer: 5, order: 1, sectionId: '6.2', star: 3, note: '递归+迭代查询' },
  { id: 'ap_ftp', label: 'FTP', layer: 5, order: 2, sectionId: '6.3', star: 2, note: '控制连接21+数据连接20' },
  { id: 'ap_mail', label: 'SMTP·POP3·IMAP', layer: 5, order: 3, sectionId: '6.4', star: 2 },
  { id: 'ap_http', label: 'WWW·HTTP', layer: 5, order: 4, sectionId: '6.5', star: 3, note: '请求/响应、GET vs POST' },
  { id: 'ap_https', label: 'HTTPS', layer: 5, order: 5, sectionId: '6.5', star: 3 },
  { id: 'ap_dhcp', label: 'DHCP', layer: 5, order: 6, sectionId: '4.3', star: 2, note: 'DORA 自动分配 IP' },
  { id: 'ap_dnshttp', label: '域名解析链', layer: 5, order: 7, sectionId: '6.2', star: 1, note: '浏览网页 = DNS + HTTP + TCP 协同' },

  // —— 安全 · 管理 · 新技术 ——
  { id: 's_threat', label: '安全威胁·服务', layer: 6, order: 0, sectionId: '7.1', star: 1 },
  { id: 's_crypto', label: '对称·非对称加密', layer: 6, order: 1, sectionId: '7.2', star: 2 },
  { id: 's_sign', label: '数字签名', layer: 6, order: 2, sectionId: '7.2', star: 2 },
  { id: 's_tls', label: 'SSL/TLS', layer: 6, order: 3, sectionId: '7.3', star: 2 },
  { id: 's_vpn', label: 'IPSec·VPN', layer: 6, order: 4, sectionId: '7.3', star: 2 },
  { id: 's_fw', label: '防火墙', layer: 6, order: 5, star: 1 },
  { id: 's_snmp', label: 'SNMP·网络管理', layer: 6, order: 6, sectionId: '8.1', star: 1 },
  { id: 's_sdn', label: 'SDN·CDN', layer: 6, order: 7, sectionId: '8.2', star: 1, note: '控制/数据平面分离；内容分发' },
]

/* ============ 边定义：flow(封装数据流) / dep(依赖) / rel(关联) ============ */
type EdgeType = 'flow' | 'dep' | 'rel'
interface EdgeDef { from: string; to: string; type: EdgeType }
const edges: EdgeDef[] = [
  // 体系结构内部
  { from: 'a_model', to: 'a_osi', type: 'rel' },
  { from: 'a_model', to: 'a_tcpip', type: 'rel' },
  { from: 'a_model', to: 'a_pdu', type: 'dep' },
  { from: 'a_pdu', to: 'a_perf', type: 'rel' },
  { from: 'a_proto', to: 'a_pdu', type: 'rel' },

  // 物理层内部
  { from: 'p_channel', to: 'p_nyq', type: 'dep' },
  { from: 'p_channel', to: 'p_shannon', type: 'dep' },
  { from: 'p_nyq', to: 'p_shannon', type: 'rel' },
  { from: 'p_shannon', to: 'p_encode', type: 'rel' },
  { from: 'p_encode', to: 'p_media', type: 'rel' },
  { from: 'p_media', to: 'p_hub', type: 'dep' },

  // 数据链路层内部
  { from: 'd_frame', to: 'd_transp', type: 'dep' },
  { from: 'd_frame', to: 'd_crc', type: 'rel' },
  { from: 'd_crc', to: 'd_ham', type: 'rel' },
  { from: 'd_flow', to: 'd_crc', type: 'rel' },
  { from: 'd_csma', to: 'd_eth', type: 'dep' },
  { from: 'd_ppp', to: 'd_frame', type: 'dep' },
  { from: 'd_eth', to: 'd_switch', type: 'dep' },
  { from: 'd_wifi', to: 'd_csma', type: 'rel' },

  // 网络层内部
  { from: 'n_ipv4', to: 'n_addr', type: 'dep' },
  { from: 'n_addr', to: 'n_subnet', type: 'dep' },
  { from: 'n_subnet', to: 'n_cidr', type: 'flow' },
  { from: 'n_cidr', to: 'n_rp', type: 'rel' },
  { from: 'n_ipv4', to: 'n_arp', type: 'dep' },
  { from: 'n_ipv4', to: 'n_icmp', type: 'dep' },
  { from: 'n_ipv4', to: 'n_nat', type: 'dep' },
  { from: 'n_nat', to: 'n_subnet', type: 'rel' },
  { from: 'n_ipv4', to: 'n_ipv6', type: 'rel' },
  { from: 'n_rp', to: 'n_router', type: 'dep' },
  { from: 'n_arp', to: 'n_router', type: 'rel' },

  // 传输层内部
  { from: 't_port', to: 't_tcp', type: 'dep' },
  { from: 't_port', to: 't_udp', type: 'dep' },
  { from: 't_tcp', to: 't_hand', type: 'dep' },
  { from: 't_tcp', to: 't_reliable', type: 'dep' },
  { from: 't_tcp', to: 't_flow', type: 'dep' },
  { from: 't_tcp', to: 't_cong', type: 'dep' },
  { from: 't_reliable', to: 't_cong', type: 'dep' },
  { from: 't_flow', to: 't_cong', type: 'rel' },
  { from: 't_udp', to: 't_tcp', type: 'rel' },

  // 应用层内部
  { from: 'ap_http', to: 'ap_https', type: 'dep' },
  { from: 'ap_dns', to: 'ap_dnshttp', type: 'rel' },

  // 安全内部
  { from: 's_crypto', to: 's_sign', type: 'rel' },
  { from: 's_tls', to: 's_vpn', type: 'rel' },
  { from: 's_threat', to: 's_crypto', type: 'dep' },

  // ★ 跨层封装数据流：HTTP → TCP → IP → 以太网帧 → 信道比特
  { from: 'ap_http', to: 't_tcp', type: 'flow' },
  { from: 't_tcp', to: 'n_ipv4', type: 'flow' },
  { from: 'n_ipv4', to: 'd_eth', type: 'flow' },
  { from: 'd_eth', to: 'p_channel', type: 'flow' },

  // 跨层依赖 / 关联
  { from: 'a_pdu', to: 'd_frame', type: 'rel' },
  { from: 'ap_dns', to: 't_udp', type: 'dep' },
  { from: 'ap_ftp', to: 't_tcp', type: 'dep' },
  { from: 'ap_mail', to: 't_tcp', type: 'dep' },
  { from: 'ap_dhcp', to: 't_udp', type: 'dep' },
  { from: 'ap_dhcp', to: 'n_subnet', type: 'rel' },
  { from: 'ap_https', to: 's_tls', type: 'dep' },
  { from: 'ap_dns', to: 'n_arp', type: 'rel' },
  { from: 'n_arp', to: 'd_eth', type: 'dep' },
  { from: 'd_flow', to: 't_reliable', type: 'dep' },
  { from: 'd_csma', to: 'p_channel', type: 'rel' },
  { from: 'p_encode', to: 'd_eth', type: 'rel' },
  { from: 'n_router', to: 'd_switch', type: 'rel' },
  { from: 's_fw', to: 'n_nat', type: 'rel' },
  { from: 's_sdn', to: 'n_router', type: 'rel' },
  { from: 's_vpn', to: 'n_ipv4', type: 'rel' },
]

/* ============ 布局计算 ============ */
const nodeMap = new Map<string, NodeDef>()
nodes.forEach(n => nodeMap.set(n.id, n))

const maxOrder = computed(() => {
  let m = 0
  nodes.forEach(n => { if (n.order > m) m = n.order })
  return m
})
const CANVAS_W = LEFT + (maxOrder.value + 1) * STEP + 40
const CANVAS_H = BAND_TOP + layers.length * BAND_H + 30

interface PlacedNode extends NodeDef { x: number; y: number; cx: number; cy: number }
const layoutNodes = computed<PlacedNode[]>(() =>
  nodes.map(n => {
    const x = LEFT + n.order * STEP
    const y = BAND_TOP + n.layer * BAND_H + (BAND_H - NODE_H) / 2
    return { ...n, x, y, cx: x + NODE_W / 2, cy: y + NODE_H / 2 }
  })
)

function nodeById(id: string): PlacedNode | undefined {
  return layoutNodes.value.find(n => n.id === id)
}

interface PlacedEdge extends EdgeDef { d: string }
const layoutEdges = computed<PlacedEdge[]>(() => {
  const placed = layoutNodes.value
  const out: PlacedEdge[] = []
  for (const e of edges) {
    const s = placed.find(n => n.id === e.from)
    const t = placed.find(n => n.id === e.to)
    if (!s || !t) continue
    out.push({ ...e, d: buildPath(s, t) })
  }
  return out
})

// 根据两节点的相对层次，选取锚点，画平滑三次贝塞尔曲线
function buildPath(s: PlacedNode, t: PlacedNode): string {
  let sx: number, sy: number, tx: number, ty: number
  let sDir: 'down' | 'up' | 'right' | 'left'
  let tDir: 'down' | 'up' | 'right' | 'left'

  if (t.layer > s.layer) {
    sDir = 'down'; tDir = 'up'
    sx = s.cx; sy = s.y + NODE_H
    tx = t.cx; ty = t.y
  } else if (t.layer < s.layer) {
    sDir = 'up'; tDir = 'down'
    sx = s.cx; sy = s.y
    tx = t.cx; ty = t.y + NODE_H
  } else {
    // 同层
    if (t.cx >= s.cx) { sDir = 'right'; tDir = 'left'; sx = s.x + NODE_W; sy = s.cy; tx = t.x; ty = t.cy }
    else { sDir = 'left'; tDir = 'right'; sx = s.x; sy = s.cy; tx = t.x + NODE_W; ty = t.cy }
  }

  if (sDir === 'down') {
    const k = clamp(Math.abs(ty - sy) * 0.45, 36, 120)
    return `M ${sx} ${sy} C ${sx} ${sy + k}, ${tx} ${ty - k}, ${tx} ${ty}`
  }
  if (sDir === 'up') {
    const k = clamp(Math.abs(sy - ty) * 0.45, 36, 120)
    return `M ${sx} ${sy} C ${sx} ${sy - k}, ${tx} ${ty + k}, ${tx} ${ty}`
  }
  if (sDir === 'right') {
    const k = clamp(Math.abs(tx - sx) * 0.45, 24, 80)
    const lift = sDir === 'right' ? -22 : 0
    return `M ${sx} ${sy} C ${sx + k} ${sy + lift}, ${tx - k} ${ty + lift}, ${tx} ${ty}`
  }
  // left
  const k = clamp(Math.abs(sx - tx) * 0.45, 24, 80)
  return `M ${sx} ${sy} C ${sx - k} ${sy - 22}, ${tx + k} ${ty - 22}, ${tx} ${ty}`
}

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v))
}

/* ============ 交互状态 ============ */
const hoverId = ref('')
const selectedId = ref('')
const activeId = computed(() => hoverId.value || selectedId.value)

const neighborIds = computed(() => {
  const set = new Set<string>()
  if (!activeId.value) return set
  for (const e of edges) {
    if (e.from === activeId.value) set.add(e.to)
    if (e.to === activeId.value) set.add(e.from)
  }
  return set
})

function isEdgeActive(e: EdgeDef): boolean {
  return !!activeId.value && (e.from === activeId.value || e.to === activeId.value)
}
function isEdgeDimmed(e: EdgeDef): boolean {
  return !!activeId.value && !isEdgeActive(e)
}
function isNodeDimmed(n: PlacedNode): boolean {
  if (!activeId.value) return false
  return n.id !== activeId.value && !neighborIds.value.has(n.id)
}

function selectNode(n: PlacedNode) {
  selectedId.value = selectedId.value === n.id ? '' : n.id
}
function clearSelection() {
  selectedId.value = ''
}
function focusById(id: string) {
  selectedId.value = id
}

function relatedOf(id: string): { id: string; label: string }[] {
  const seen = new Set<string>()
  const res: { id: string; label: string }[] = []
  for (const e of edges) {
    const other = e.from === id ? e.to : e.to === id ? e.from : null
    if (other && !seen.has(other)) {
      seen.add(other)
      const node = nodeMap.get(other)
      if (node) res.push({ id: other, label: node.label })
    }
  }
  return res
}

function jumpToSection(n: NodeDef) {
  if (!n.sectionId) return
  networkStore.selectSection(n.sectionId)
}

/* ============ 样式辅助 ============ */
function layerColor(layer: number): string {
  return layers[layer].color
}
function arrowFor(type: EdgeType): string {
  return `url(#nkm-arrow-${type})`
}
function nodeStyle(n: PlacedNode) {
  return {
    left: n.x + 'px',
    top: n.y + 'px',
    width: NODE_W + 'px',
    height: NODE_H + 'px',
  }
}
function bandStyle(li: number) {
  return {
    top: BAND_TOP + li * BAND_H + 'px',
    height: BAND_H + 'px',
  }
}
function countInLayer(li: number): number {
  return nodes.filter(n => n.layer === li).length
}

const selectedNode = computed(() =>
  selectedId.value ? layoutNodes.value.find(n => n.id === selectedId.value) || null : null
)
const selectedLayer = computed(() => {
  return selectedNode.value ? layers[selectedNode.value.layer] : layers[0]
})

/* ============ 缩放 / 全屏 ============ */
const zoom = ref(1)
const canvasRef = ref<HTMLElement | null>(null)
const viewportRef = ref<HTMLElement | null>(null)
const isFullscreen = ref(false)

const canvasStyle = computed(() => ({
  width: CANVAS_W + 'px',
  height: CANVAS_H + 'px',
  transform: `scale(${zoom.value})`,
  transformOrigin: 'top left',
}))

function zoomIn() { zoom.value = Math.min(zoom.value + 0.15, 2.2) }
function zoomOut() { zoom.value = Math.max(zoom.value - 0.15, 0.5) }
function resetView() { zoom.value = 1 }

function toggleFullscreen() {
  const el = viewportRef.value
  if (!el) return
  if (!document.fullscreenElement) {
    el.requestFullscreen?.()
    isFullscreen.value = true
  } else {
    document.exitFullscreen?.()
    isFullscreen.value = false
  }
}
document.addEventListener('fullscreenchange', () => {
  isFullscreen.value = !!document.fullscreenElement
})
</script>

<style scoped lang="scss">
.network-knowledge-map {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #fff;
  overflow: hidden;

  .nkm-header {
    padding: 14px 20px;
    border-bottom: 1px solid #e8e8e8;
    display: flex;
    align-items: center;
    gap: 12px;

    .nkm-title {
      flex: 1;
      min-width: 0;
      h3 {
        margin: 0;
        font-size: 16px;
        color: #16345c;
        letter-spacing: 0.02em;
      }
      .nkm-sub {
        display: block;
        margin-top: 2px;
        font-size: 12px;
        color: #8a99ac;
      }
    }
    .nkm-controls {
      display: flex;
      gap: 8px;
      flex-shrink: 0;
    }
  }

  .nkm-legend {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 16px;
    padding: 8px 20px;
    background: #f5f8fc;
    border-bottom: 1px solid #e4ebf3;
    font-size: 12.5px;
    color: #41566f;

    .lg-item { display: inline-flex; align-items: center; gap: 6px; }
    .lg-line { display: inline-block; width: 26px; height: 0; border-top: 2px solid #999; }
    .lg-flow { border-top: 3px solid #f76707; }
    .lg-dep { border-top: 2px dashed #868e96; }
    .lg-rel { border-top: 2px dotted #4dabf7; }
    .lg-tip { margin-left: auto; color: #9aa8b8; }
  }

  .nkm-viewport {
    flex: 1;
    position: relative;
    overflow: auto;
    background:
      linear-gradient(180deg, #fbfdff 0%, #f3f7fb 100%);
    padding: 8px;

    &:fullscreen {
      background: #fff;
      padding: 20px;
    }
  }

  .nkm-canvas {
    position: relative;
    // 尺寸与 transform 由内联样式提供
  }

  .nkm-band {
    position: absolute;
    left: 0;
    right: 0;
    border-bottom: 1px dashed #d5deea;

    &:nth-child(odd) { background: rgba(245, 248, 252, 0.55); }
  }
  .nkm-band-spine {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 148px;
    padding: 10px 10px 10px 14px;
    border-left: 5px solid #ccc;
    background: #fff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 3px;

    .spine-title { font-size: 14px; font-weight: 700; color: #1f2d3d; line-height: 1.3; }
    .spine-score { font-size: 11px; color: #d98b00; font-weight: 600; }
    .spine-count { font-size: 11px; color: #93a2b4; }
  }

  .nkm-edges {
    position: absolute;
    left: 0;
    top: 0;
    pointer-events: none;
    overflow: visible;
  }
  .nkm-edge {
    fill: none;
    stroke-width: 1.6;
    transition: opacity 0.18s, stroke-width 0.18s;

    &.edge-flow { stroke: #f76707; stroke-width: 2.4; opacity: 0.75; }
    &.edge-dep { stroke: #868e96; stroke-dasharray: 5 4; opacity: 0.55; }
    &.edge-rel { stroke: #4dabf7; stroke-dasharray: 1.5 5; stroke-linecap: round; opacity: 0.5; }

    &.active { opacity: 1 !important; stroke-width: 3.4; filter: drop-shadow(0 1px 2px rgba(0,0,0,0.18)); }
    &.dimmed { opacity: 0.08 !important; }
  }

  .nkm-node {
    position: absolute;
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 0 10px;
    background: #fff;
    border: 1.5px solid #dbe3ec;
    border-radius: 9px;
    box-shadow: 0 2px 6px rgba(20, 40, 70, 0.06);
    cursor: pointer;
    user-select: none;
    transition: transform 0.15s, box-shadow 0.15s, opacity 0.15s, border-color 0.15s;

    .node-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
    .node-label {
      flex: 1;
      font-size: 12.5px;
      line-height: 1.25;
      color: #24354a;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    .node-star { color: #f0a820; font-size: 12px; font-weight: 700; flex-shrink: 0; }

    &:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(20, 40, 70, 0.14); border-color: #b9c7d8; }

    &.active {
      border-color: #16345c;
      box-shadow: 0 8px 20px rgba(22, 52, 92, 0.22);
      transform: translateY(-2px);
    }
    &.selected {
      border-width: 2px;
      border-color: #ffc53d;
      box-shadow: 0 0 0 3px rgba(255, 197, 61, 0.28), 0 8px 20px rgba(22, 52, 92, 0.16);
    }
    &.jumpable { background: linear-gradient(180deg, #ffffff, #f8fbff); }
    &.dimmed { opacity: 0.32; }

    &.star-3 .node-label { font-weight: 600; }
  }

  .nkm-detail {
    position: sticky;
    top: 0;
    float: right;
    margin: 4px 4px 0 0;
    width: 288px;
    background: #fff;
    border: 1px solid #e4ebf3;
    border-radius: 12px;
    box-shadow: 0 8px 26px rgba(13, 33, 55, 0.16);
    overflow: hidden;
    z-index: 20;

    .dt-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 9px 14px;
      color: #fff;
      .dt-layer { font-size: 13px; font-weight: 700; }
      .dt-close { cursor: pointer; font-size: 20px; line-height: 1; opacity: 0.9; }
    }
    .dt-body { padding: 12px 14px 14px; }
    .dt-name { font-size: 15px; font-weight: 700; color: #1f2d3d; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
    .dt-star { font-size: 11px; color: #d98b00; background: #fff6e5; border: 1px solid #ffe1a8; border-radius: 10px; padding: 1px 8px; }
    .dt-note { font-size: 12.5px; color: #5b6b7f; line-height: 1.6; margin: 8px 0 0; }
    .dt-rel { margin-top: 12px; }
    .rel-cap { display: block; font-size: 11px; color: #93a2b4; margin-bottom: 6px; }
    .rel-chip {
      display: inline-block;
      font-size: 12px;
      color: #16345c;
      background: #eef3fa;
      border-radius: 12px;
      padding: 2px 9px;
      margin: 0 6px 6px 0;
      cursor: pointer;
      transition: background 0.15s;
      &:hover { background: #d9e6f5; }
    }
    .dt-jump { margin-top: 14px; width: 100%; }
    .dt-nojump { display: inline-block; margin-top: 12px; font-size: 12px; color: #a3b0bf; }
  }
}
</style>
