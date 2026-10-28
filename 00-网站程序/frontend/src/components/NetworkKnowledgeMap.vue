<template>
  <div class="nkm" ref="stageRef">
    <!-- ===== 画布：一整张概念地图（纯 SVG，随缩放平移） ===== -->
    <svg
      ref="svgRef"
      class="nkm-canvas"
      :width="vw"
      :height="vh"
      @pointerdown="onDown"
      @wheel.prevent="onWheel"
    >
      <defs>
        <!-- 各类型箭头 -->
        <marker id="m-flow" markerWidth="9" markerHeight="9" refX="6.4" refY="3" orient="auto">
          <path d="M0,0 L7,3 L0,6 Z" fill="#e8930c" />
        </marker>
        <marker id="m-dep" markerWidth="8" markerHeight="8" refX="6" refY="2.8" orient="auto">
          <path d="M0,0 L6.5,2.8 L0,5.6 Z" fill="#2f9e44" />
        </marker>
        <marker id="m-rel" markerWidth="8" markerHeight="8" refX="6" refY="2.8" orient="auto">
          <path d="M0,0 L6.5,2.8 L0,5.6 Z" fill="#4c6ef5" />
        </marker>
        <filter id="soft" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="1.5" stdDeviation="1.6" flood-color="#16345c" flood-opacity="0.18" />
        </filter>
        <filter id="goldglow" x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="0" stdDeviation="2.4" flood-color="#f59f00" flood-opacity="0.6" />
        </filter>
      </defs>

      <g :transform="`translate(${view.x} ${view.y}) scale(${view.k})`">
        <!-- 1) 层级分支（树骨架，按层配色，永远可见） -->
        <path
          v-for="(b, i) in branchLinks"
          :key="'br' + i"
          :d="b.d"
          class="lnk branch"
          :class="{ faint: b.faint, hi: b.hi }"
          :stroke="b.color"
        />

        <!-- 2) 同层内部关联（默认隐藏，悬停/选中该点时才浮现） -->
        <path
          v-for="(e, i) in shownIntra"
          :key="'in' + i"
          :d="e.d"
          class="lnk intra"
          :class="'t-' + e.type"
          :marker-end="arrowFor(e.type)"
        />

        <!-- 3) 跨层关联线（构成"体系"，默认全部可见，按类型配色） -->
        <path
          v-for="(e, i) in crossLinks"
          :key="'cx' + i"
          :d="e.d"
          class="lnk cross"
          :class="['t-' + e.type, { chain: e.chain, faint: e.faint, hi: e.hi }]"
          :marker-end="arrowFor(e.type)"
        />

        <!-- 4) 节点：根 · 层 · 考点 -->
        <g
          class="node root"
          :transform="`translate(${root.cx} ${root.cy})`"
          filter="url(#soft)"
        >
          <rect :x="-root.w / 2" :y="-root.h / 2" :width="root.w" :height="root.h" rx="12" />
          <text class="rt-t" text-anchor="middle" dominant-baseline="middle" :y="-2">计算机网络</text>
          <text class="rt-s" text-anchor="middle" dominant-baseline="middle" :y="13">408 · 知识体系地图</text>
        </g>

        <g
          v-for="L in layerBoxes"
          :key="'ly' + L.idx"
          class="node layer"
          :transform="`translate(${L.cx} ${L.cy})`"
          filter="url(#soft)"
        >
          <rect :x="-L.w / 2" :y="-L.h / 2" :width="L.w" :height="L.h" rx="10" :fill="L.color" />
          <text class="ly-t" text-anchor="middle" dominant-baseline="middle" :y="-6">{{ L.label }}</text>
          <text class="ly-s" text-anchor="middle" dominant-baseline="middle" :y="11">
            {{ L.count }} 考点{{ L.score ? ' · ' + L.score : '' }}
          </text>
        </g>

        <g
          v-for="n in nodeBoxes"
          :key="n.id"
          class="node concept"
          :class="{ star: n.star === 3, sel: n.id === selectedId, faint: isFaint(n.id) }"
          :transform="`translate(${n.cx} ${n.cy})`"
          @mouseenter="hoverId = n.id"
          @mouseleave="hoverId = ''"
          @click.stop="selectNode(n)"
        >
          <rect
            :x="-n.w / 2"
            :y="-n.h / 2"
            :width="n.w"
            :height="n.h"
            :rx="n.star === 3 ? 9 : 7"
            :stroke="n.color"
          />
          <text
            class="cn-t"
            text-anchor="middle"
            dominant-baseline="middle"
            :font-size="n.fs"
          ><tspan v-if="n.star === 3" class="cn-star">★ </tspan>{{ n.short }}</text>
        </g>
      </g>
    </svg>

    <!-- ===== 极简标题（左上，浮于画布） ===== -->
    <div class="nkm-title">
      <b>计算机网络 · 知识体系图</b>
      <span>顺着线条看：中心 → 七层 → 考点，彩色曲线是跨层关联，金色粗线是封装流</span>
    </div>

    <!-- ===== 图例（右上，小巧） ===== -->
    <div class="nkm-legend">
      <div class="lg-row"><i class="lg-swatch" style="background:#16345c"></i>层分支颜色＝所属层</div>
      <div class="lg-row"><i class="lg-line flow"></i>封装流 报文→段→分组→帧→比特</div>
      <div class="lg-row"><i class="lg-line dep"></i>依赖（A 需要 B）</div>
      <div class="lg-row"><i class="lg-line rel"></i>关联 / 对比</div>
      <div class="lg-row"><b class="lg-star">★</b>高频考点 · 点考点跳正文</div>
    </div>

    <!-- ===== 缩放控制（右下，浮动） ===== -->
    <div class="nkm-tools">
      <button @click="zoomBy(1.18)" title="放大">＋</button>
      <button @click="zoomBy(1 / 1.18)" title="缩小">－</button>
      <button @click="fit" title="适应全屏">适应</button>
      <button @click="toggleFullscreen" title="全屏">
        <el-icon><FullScreen /></el-icon>
      </button>
    </div>

    <!-- ===== 悬停/选中提示（左下浮动，仅一点时出现） ===== -->
    <transition name="pop">
      <div v-if="infoNode" class="nkm-tip" :style="{ borderColor: layerColor(infoNode.layer) }">
        <div class="tp-head">
          <span class="tp-layer" :style="{ background: layerColor(infoNode.layer) }">
            {{ layers[infoNode.layer].label }}
          </span>
          <span v-if="infoNode.star === 3" class="tp-star">高频 ★</span>
        </div>
        <div class="tp-name">{{ infoNode.label }}</div>
        <p v-if="infoNode.note" class="tp-note">{{ infoNode.note }}</p>
        <div v-if="relatedOf(infoNode.id).length" class="tp-rel">
          <span class="rel-cap">关联考点</span>
          <span
            v-for="r in relatedOf(infoNode.id)"
            :key="r.id"
            class="rel-chip"
            :style="{ borderColor: layerColor(r.layer) }"
            @mouseenter="hoverId = r.id"
            @click="jump(r.id)"
          >{{ r.label }}</span>
        </div>
        <a v-if="infoNode.sectionId" class="tp-jump" @click="jump(infoNode.id)">
          跳转到 {{ infoNode.sectionId }} 正文 →
        </a>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useNetworkStore } from '@/stores/network'
import { FullScreen } from '@element-plus/icons-vue'

const networkStore = useNetworkStore()

/* ============ 分层定义（数据索引不变：0体系 1物理 2链路 3网络 4传输 5应用 6安全） ============ */
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

/* 沿封装方向的从左到右排布：总纲 · 应用→传输→网络→链路→物理 · 安全横切 */
const ltrOrder = [0, 5, 4, 3, 2, 1, 6]

function chapterScore(chapterId?: string): string {
  if (!chapterId) return ''
  return networkStore.chapters.find(c => c.id === chapterId)?.score || ''
}

/* ============ 节点定义（完整保留原字段） ============ */
type Role = 'func' | 'proto' | 'dev' | 'calc'
interface NodeDef {
  id: string
  label: string
  layer: number
  order: number
  q?: Role
  sectionId?: string
  star?: number
  note?: string
}
const nodes: NodeDef[] = [
  // —— 体系结构 ——
  { id: 'a_model', label: '五层参考模型', layer: 0, order: 0, q: 'func', sectionId: '1.2', star: 3, note: '物数网传会表应，贯穿整本计网的骨架' },
  { id: 'a_osi', label: 'OSI 七层', layer: 0, order: 1, q: 'func', sectionId: '1.2', star: 3 },
  { id: 'a_tcpip', label: 'TCP/IP 四层', layer: 0, order: 2, q: 'func', sectionId: '1.2', star: 2 },
  { id: 'a_pdu', label: '封装·PDU', layer: 0, order: 3, q: 'func', sectionId: '1.1', star: 3, note: '报文→段→分组→帧→比特，PDU=PCI+SDU' },
  { id: 'a_switch', label: '三种交换方式', layer: 0, order: 4, q: 'func', sectionId: '1.1', star: 3, note: '电路/报文/分组交换对比' },
  { id: 'a_perf', label: '时延·带宽', layer: 0, order: 5, q: 'calc', sectionId: '1.1', star: 3, note: '发送时延 vs 传播时延、RTT' },
  { id: 'a_proto', label: '协议三要素', layer: 0, order: 6, q: 'func', sectionId: '1.1', star: 3, note: '语法·语义·时序' },

  // —— 物理层 ——
  { id: 'p_channel', label: '信道·信号·码元', layer: 1, order: 0, q: 'func', sectionId: '2.1', star: 2 },
  { id: 'p_nyq', label: '奈奎斯特定理', layer: 1, order: 1, q: 'calc', sectionId: '2.1', star: 2, note: '无噪声极限 2W·log₂V' },
  { id: 'p_shannon', label: '香农定理', layer: 1, order: 2, q: 'calc', sectionId: '2.1', star: 3, note: '有噪声极限 W·log₂(1+S/N)' },
  { id: 'p_encode', label: '编码与调制', layer: 1, order: 3, q: 'func', sectionId: '2.1', star: 2, note: '曼彻斯特/差分曼彻斯特/QAM' },
  { id: 'p_media', label: '传输介质', layer: 1, order: 4, q: 'dev', sectionId: '2.2', star: 2, note: '双绞线/同轴/光纤/无线' },
  { id: 'p_hub', label: '中继器·集线器', layer: 1, order: 5, q: 'dev', sectionId: '2.2', star: 1, note: '物理层设备，共享冲突域' },

  // —— 数据链路层 ——
  { id: 'd_frame', label: '封装成帧', layer: 2, order: 0, q: 'func', sectionId: '3.1', star: 2 },
  { id: 'd_transp', label: '透明传输·零比特填充', layer: 2, order: 1, q: 'func', sectionId: '3.1', star: 3 },
  { id: 'd_crc', label: '奇偶校验·CRC', layer: 2, order: 2, q: 'calc', sectionId: '3.2', star: 3, note: '检错编码，模2除法' },
  { id: 'd_ham', label: '海明码', layer: 2, order: 3, q: 'calc', sectionId: '3.2', star: 2, note: '纠错编码 2^r≥k+r+1' },
  { id: 'd_flow', label: '停等·GBN·SR', layer: 2, order: 4, q: 'func', sectionId: '3.3', star: 3, note: '滑动窗口与可靠传输' },
  { id: 'd_csma', label: 'CSMA/CD', layer: 2, order: 5, q: 'func', sectionId: '3.4', star: 3, note: '先听后发·边听边发·最小帧长' },
  { id: 'd_ppp', label: 'PPP', layer: 2, order: 6, q: 'proto', star: 2, note: '点对点协议，广域网链路' },
  { id: 'd_eth', label: '以太网·MAC·802.3', layer: 2, order: 7, q: 'proto', sectionId: '3.4', star: 3, note: '帧格式、MAC 地址' },
  { id: 'd_switch', label: '交换机', layer: 2, order: 8, q: 'dev', star: 3, note: '链路层设备，按 MAC 转发，独立冲突域' },
  { id: 'd_wifi', label: '无线 802.11·CSMA/CA', layer: 2, order: 9, q: 'proto', sectionId: '3.4', star: 2, note: '碰撞避免，RTS/CTS' },

  // —— 网络层 ——
  { id: 'n_ipv4', label: 'IP 数据报·IPv4', layer: 3, order: 0, q: 'proto', sectionId: '4.3', star: 3, note: '首部字段、分片与重组' },
  { id: 'n_addr', label: 'IP 地址·分类', layer: 3, order: 1, q: 'func', sectionId: '4.3', star: 2, note: 'A/B/C/D/E 类' },
  { id: 'n_subnet', label: '子网划分', layer: 3, order: 2, q: 'calc', sectionId: '4.3', star: 3, note: '借位、子网掩码' },
  { id: 'n_cidr', label: 'CIDR·路由聚合', layer: 3, order: 3, q: 'calc', sectionId: '4.3', star: 3, note: '无分类编址、聚合缩小路由表' },
  { id: 'n_arp', label: 'ARP', layer: 3, order: 4, q: 'proto', sectionId: '4.3', star: 3, note: 'IP→MAC，依赖 IP 与以太网' },
  { id: 'n_icmp', label: 'ICMP·ping', layer: 3, order: 5, q: 'proto', sectionId: '4.3', star: 2 },
  { id: 'n_nat', label: 'NAT', layer: 3, order: 6, q: 'func', sectionId: '4.3', star: 3, note: '私有地址↔公有地址转换' },
  { id: 'n_ipv6', label: 'IPv6', layer: 3, order: 7, q: 'proto', sectionId: '4.4', star: 2 },
  { id: 'n_rp', label: '路由协议 RIP/OSPF/BGP', layer: 3, order: 8, q: 'proto', sectionId: '4.2', star: 3, note: '距离向量 vs 链路状态' },
  { id: 'n_router', label: '路由器', layer: 3, order: 9, q: 'dev', sectionId: '4.1b', star: 3, note: '输入/交换/输出/路由处理器' },

  // —— 传输层 ——
  { id: 't_port', label: '端口·复用分用', layer: 4, order: 0, q: 'func', sectionId: '5.1', star: 2 },
  { id: 't_udp', label: 'UDP', layer: 4, order: 1, q: 'proto', sectionId: '5.2', star: 2, note: '无连接、首部 8 字节' },
  { id: 't_tcp', label: 'TCP', layer: 4, order: 2, q: 'proto', sectionId: '5.3', star: 3, note: '面向连接、可靠、字节流' },
  { id: 't_hand', label: '三次握手·四次挥手', layer: 4, order: 3, q: 'func', sectionId: '5.3', star: 3 },
  { id: 't_reliable', label: '可靠传输·超时重传', layer: 4, order: 4, q: 'func', sectionId: '5.3', star: 3 },
  { id: 't_flow', label: '流量控制·滑动窗口', layer: 4, order: 5, q: 'func', sectionId: '5.3', star: 3, note: '接收窗口 rwnd' },
  { id: 't_cong', label: '拥塞控制·慢开始', layer: 4, order: 6, q: 'calc', sectionId: '5.3', star: 3, note: '慢开始/拥塞避免/快重传/快恢复' },

  // —— 应用层 ——
  { id: 'ap_model', label: 'C/S·P2P 模型', layer: 5, order: 0, q: 'func', sectionId: '6.1', star: 2 },
  { id: 'ap_dns', label: 'DNS', layer: 5, order: 1, q: 'proto', sectionId: '6.2', star: 3, note: '递归+迭代查询' },
  { id: 'ap_ftp', label: 'FTP', layer: 5, order: 2, q: 'proto', sectionId: '6.3', star: 2, note: '控制连接21+数据连接20' },
  { id: 'ap_mail', label: 'SMTP·POP3·IMAP', layer: 5, order: 3, q: 'proto', sectionId: '6.4', star: 2 },
  { id: 'ap_http', label: 'WWW·HTTP', layer: 5, order: 4, q: 'proto', sectionId: '6.5', star: 3, note: '请求/响应、GET vs POST' },
  { id: 'ap_https', label: 'HTTPS', layer: 5, order: 5, q: 'proto', sectionId: '6.5', star: 3 },
  { id: 'ap_dhcp', label: 'DHCP', layer: 5, order: 6, q: 'proto', sectionId: '4.3', star: 2, note: 'DORA 自动分配 IP' },
  { id: 'ap_dnshttp', label: '域名解析链', layer: 5, order: 7, q: 'func', sectionId: '6.2', star: 1, note: '浏览网页 = DNS + HTTP + TCP 协同' },

  // —— 安全 · 管理 · 新技术 ——
  { id: 's_threat', label: '安全威胁·服务', layer: 6, order: 0, q: 'func', sectionId: '7.1', star: 1 },
  { id: 's_crypto', label: '对称·非对称加密', layer: 6, order: 1, q: 'func', sectionId: '7.2', star: 2 },
  { id: 's_sign', label: '数字签名', layer: 6, order: 2, q: 'func', sectionId: '7.2', star: 2 },
  { id: 's_tls', label: 'SSL/TLS', layer: 6, order: 3, q: 'proto', sectionId: '7.3', star: 2 },
  { id: 's_vpn', label: 'IPSec·VPN', layer: 6, order: 4, q: 'proto', sectionId: '7.3', star: 2 },
  { id: 's_fw', label: '防火墙', layer: 6, order: 5, q: 'dev', star: 1 },
  { id: 's_snmp', label: 'SNMP·网络管理', layer: 6, order: 6, q: 'proto', sectionId: '8.1', star: 1 },
  { id: 's_sdn', label: 'SDN·CDN', layer: 6, order: 7, q: 'dev', sectionId: '8.2', star: 1, note: '控制/数据平面分离；内容分发' },
]

/* ============ 边定义（完整保留）：flow / dep / rel ============ */
type EdgeType = 'flow' | 'dep' | 'rel'
interface EdgeDef { from: string; to: string; type: EdgeType }
const edges: EdgeDef[] = [
  { from: 'a_model', to: 'a_osi', type: 'rel' },
  { from: 'a_model', to: 'a_tcpip', type: 'rel' },
  { from: 'a_model', to: 'a_pdu', type: 'dep' },
  { from: 'a_pdu', to: 'a_perf', type: 'rel' },
  { from: 'a_proto', to: 'a_pdu', type: 'rel' },
  { from: 'p_channel', to: 'p_nyq', type: 'dep' },
  { from: 'p_channel', to: 'p_shannon', type: 'dep' },
  { from: 'p_nyq', to: 'p_shannon', type: 'rel' },
  { from: 'p_shannon', to: 'p_encode', type: 'rel' },
  { from: 'p_encode', to: 'p_media', type: 'rel' },
  { from: 'p_media', to: 'p_hub', type: 'dep' },
  { from: 'd_frame', to: 'd_transp', type: 'dep' },
  { from: 'd_frame', to: 'd_crc', type: 'rel' },
  { from: 'd_crc', to: 'd_ham', type: 'rel' },
  { from: 'd_flow', to: 'd_crc', type: 'rel' },
  { from: 'd_csma', to: 'd_eth', type: 'dep' },
  { from: 'd_ppp', to: 'd_frame', type: 'dep' },
  { from: 'd_eth', to: 'd_switch', type: 'dep' },
  { from: 'd_wifi', to: 'd_csma', type: 'rel' },
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
  { from: 't_port', to: 't_tcp', type: 'dep' },
  { from: 't_port', to: 't_udp', type: 'dep' },
  { from: 't_tcp', to: 't_hand', type: 'dep' },
  { from: 't_tcp', to: 't_reliable', type: 'dep' },
  { from: 't_tcp', to: 't_flow', type: 'dep' },
  { from: 't_tcp', to: 't_cong', type: 'dep' },
  { from: 't_reliable', to: 't_cong', type: 'dep' },
  { from: 't_flow', to: 't_cong', type: 'rel' },
  { from: 't_udp', to: 't_tcp', type: 'rel' },
  { from: 'ap_http', to: 'ap_https', type: 'dep' },
  { from: 'ap_dns', to: 'ap_dnshttp', type: 'rel' },
  { from: 's_crypto', to: 's_sign', type: 'rel' },
  { from: 's_tls', to: 's_vpn', type: 'rel' },
  { from: 's_threat', to: 's_crypto', type: 'dep' },
  // ★ 跨层封装数据流主干
  { from: 'ap_http', to: 't_tcp', type: 'flow' },
  { from: 't_tcp', to: 'n_ipv4', type: 'flow' },
  { from: 'n_ipv4', to: 'd_eth', type: 'flow' },
  { from: 'd_eth', to: 'p_channel', type: 'flow' },
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

const nodeMap = new Map<string, NodeDef>()
nodes.forEach(n => nodeMap.set(n.id, n))
function layerOf(id: string): number { return nodeMap.get(id)?.layer ?? -1 }

/* ============ 版式常量（自上而下思维导图：根→层→考点） ============ */
const COLW = 186        // 每列（层）宽
const PADX = 54
const ROOT_Y = 40
const LAYER_Y = 108
const CT_TOP = 178      // 首个考点中心 y
const PITCH = 32        // 考点行距
const CW = PADX * 2 + ltrOrder.length * COLW
const maxCount = Math.max(...ltrOrder.map(li => nodes.filter(n => n.layer === li).length))
const CH = CT_TOP + (maxCount - 1) * PITCH + 46

interface Box { cx: number; cy: number; w: number; h: number }

/* 依标签估算盒宽（CJK≈11.5，ASCII≈7） */
function estW(label: string, star?: number): number {
  let e = 0
  for (const c of label) e += c.charCodeAt(0) > 255 ? 11.5 : 7
  return Math.min(COLW - 12, Math.max(56, e + 16 + (star === 3 ? 15 : 0)))
}
/* 按像素预算精确截断（与 estW 同一度量），避免中英混排被过早截断 */
function shortLabel(label: string, w: number, star?: number): string {
  const budget = w - 16 - (star === 3 ? 15 : 0)
  let used = 0
  let out = ''
  for (const c of label) {
    const cw = c.charCodeAt(0) > 255 ? 11.5 : 7
    if (used + cw > budget + 3 && out.length < label.length) return out + '…'
    used += cw
    out += c
  }
  return label
}

/* ============ 生成布局（静态数据，setup 期一次算好） ============ */
const colCenter = (i: number) => PADX + i * COLW + COLW / 2

const root: Box & { cx: number; cy: number } = { cx: CW / 2, cy: ROOT_Y, w: 152, h: 38 }

const layerBoxes: (Box & { idx: number; label: string; color: string; count: number; score: string })[] =
  ltrOrder.map((li, i) => {
    const L = layers[li]
    return {
      cx: colCenter(i), cy: LAYER_Y, w: COLW - 16, h: 44,
      idx: li, label: L.label, color: L.color,
      count: nodes.filter(n => n.layer === li).length,
      score: chapterScore(L.chapterId),
    }
  })

const nodeBoxes: (Box & { id: string; color: string; star?: number; short: string; fs: number })[] = []
ltrOrder.forEach((li, i) => {
  const cx = colCenter(i)
  const color = layers[li].color
  const inL = nodes.filter(n => n.layer === li).sort((a, b) => a.order - b.order)
  inL.forEach((n, r) => {
    const w = estW(n.label, n.star)
    const h = n.star === 3 ? 26 : 22
    nodeBoxes.push({
      cx, cy: CT_TOP + r * PITCH, w, h,
      id: n.id, color, star: n.star, short: shortLabel(n.label, w, n.star),
      fs: w >= COLW - 14 ? 10.5 : 11.2,
    })
  })
})

const boxOf = new Map<string, Box>()
nodeBoxes.forEach(b => boxOf.set(b.id, b))

/* 路径工具 */
function branchPath(L: Box, C: Box): string {
  const sx = L.cx, sy = L.cy + L.h / 2
  const ex = C.cx, ey = C.cy - C.h / 2
  const my = (sy + ey) / 2
  return `M${sx},${sy} C${sx},${my} ${ex},${my} ${ex},${ey}`
}
function rootPath(L: Box): string {
  const sx = root.cx, sy = root.cy + root.h / 2
  const ex = L.cx, ey = L.cy - L.h / 2
  const my = (sy + ey) / 2
  return `M${sx},${sy} C${sx},${my} ${ex},${my} ${ex},${ey}`
}
/* 关联线：跨列走横向 S 弧，同列走右侧外凸弧 */
function linkPath(a: Box, b: Box): string {
  const dx = b.cx - a.cx
  const dy = b.cy - a.cy
  if (Math.abs(dx) > a.w) {
    const dir = dx > 0 ? 1 : -1
    const sx = a.cx + dir * (a.w / 2), sy = a.cy
    const ex = b.cx - dir * (b.w / 2), ey = b.cy
    const mx = (sx + ex) / 2
    return `M${sx},${sy} C${mx},${sy} ${mx},${ey} ${ex},${ey}`
  }
  const dir = dy > 0 ? 1 : -1
  const sx = a.cx + a.w * 0.32, sy = a.cy + dir * (a.h / 2)
  const ex = b.cx + b.w * 0.32, ey = b.cy - dir * (b.h / 2)
  const off = 40
  return `M${sx},${sy} C${sx + off},${sy + dir * off} ${ex + off},${ey - dir * off} ${ex},${ey}`
}

const layerBoxOf = new Map<number, Box>()
layerBoxes.forEach(L => layerBoxOf.set(L.idx, L))

/* 树骨架：根→层，层→考点（永远可见，按层配色） */
interface BranchLink { d: string; color: string; ids: string[]; faint: boolean; hi: boolean }
const branchLinks = computed<BranchLink[]>(() => {
  const act = activeId.value
  const arr: BranchLink[] = []
  layerBoxes.forEach(L => {
    const rid = 'root'
    const touched = act === rid || act === 'L' + L.idx || (act && nodeOfLayerHas(L.idx, act))
    arr.push({ d: rootPath(L), color: L.color, ids: [rid], faint: !!act && !touched, hi: !!act && touched })
  })
  nodeBoxes.forEach(nb => {
    const n = nodeMap.get(nb.id)!
    const L = layerBoxOf.get(n.layer)!
    const touched = act === nb.id || act === 'L' + n.layer || neighborOf(act).has(nb.id)
    arr.push({ d: branchPath(L, nb), color: n.color, ids: [nb.id], faint: !!act && !touched, hi: !!act && touched })
  })
  return arr
})
function nodeOfLayerHas(layer: number, act: string | ''): boolean {
  return !!act && nodeMap.get(act)?.layer === layer
}

/* 跨层关联（构成体系，默认全部可见） */
interface CrossLink { d: string; type: EdgeType; chain: boolean; from: string; to: string; faint: boolean; hi: boolean }
const crossLinks = computed<CrossLink[]>(() => {
  const act = activeId.value
  const out: CrossLink[] = []
  for (const e of edges) {
    if (layerOf(e.from) === layerOf(e.to)) continue // 同层交给 intra
    const a = boxOf.get(e.from), b = boxOf.get(e.to)
    if (!a || !b) continue
    const touched = act === e.from || act === e.to
    out.push({ d: linkPath(a, b), type: e.type, chain: e.type === 'flow', from: e.from, to: e.to, faint: !!act && !touched, hi: !!act && touched })
  }
  return out
})

/* 同层关联（默认隐藏，悬停/选中时才浮现） */
const shownIntra = computed<CrossLink[]>(() => {
  const act = activeId.value
  if (!act) return []
  const out: CrossLink[] = []
  for (const e of edges) {
    if (layerOf(e.from) === layerOf(e.to) && (e.from === act || e.to === act)) {
      const a = boxOf.get(e.from), b = boxOf.get(e.to)
      if (!a || !b) continue
      out.push({ d: linkPath(a, b), type: e.type, chain: e.type === 'flow', from: e.from, to: e.to, faint: false, hi: true })
    }
  }
  return out
})

function arrowFor(type: EdgeType): string {
  return `url(#m-${type})`
}

/* ============ 交互 ============ */
const hoverId = ref('')
const selectedId = ref('')
const activeId = computed<string>(() => hoverId.value || selectedId.value)

const neighborCache = new Map<string, Set<string>>()
function neighborOf(id: string | ''): Set<string> {
  if (!id) return new Set()
  let s = neighborCache.get(id)
  if (!s) {
    s = new Set<string>()
    for (const e of edges) {
      if (e.from === id) s.add(e.to)
      if (e.to === id) s.add(e.from)
    }
    const nl = nodeMap.get(id)?.layer
    if (nl != null) s.add('L' + nl)
    neighborCache.set(id, s)
  }
  return s
}
function isFaint(id: string): boolean {
  if (!activeId.value) return false
  if (id === activeId.value) return false
  if (neighborOf(activeId.value).has(id)) return false
  const al = nodeMap.get(activeId.value)?.layer
  if (al != null && nodeMap.get(id)?.layer === al) return false // 同层不淡出，保留层次
  return true
}

function selectNode(n: Box & { id: string }) {
  if (moved) return
  const nd = nodeMap.get(n.id)
  if (!nd) return
  selectedId.value = selectedId.value === n.id ? '' : n.id
  if (selectedId.value && nd.sectionId) networkStore.selectSection(nd.sectionId)
}
function jump(id: string) {
  const nd = nodeMap.get(id)
  if (!nd) return
  selectedId.value = id
  hoverId.value = id
  if (nd.sectionId) networkStore.selectSection(nd.sectionId)
}

const infoNode = computed<NodeDef | null>(() => {
  const id = selectedId.value || hoverId.value
  return id ? nodeMap.get(id) || null : null
})
function relatedOf(id: string): { id: string; label: string; layer: number }[] {
  const seen = new Set<string>()
  const res: { id: string; label: string; layer: number }[] = []
  for (const e of edges) {
    const other = e.from === id ? e.to : e.to === id ? e.from : null
    if (other && !seen.has(other)) {
      seen.add(other)
      const node = nodeMap.get(other)
      if (node) res.push({ id: other, label: node.label, layer: node.layer })
    }
  }
  return res
}
function layerColor(layer: number): string { return layers[layer].color }

/* ============ 缩放 / 平移 / 全屏 ============ */
const stageRef = ref<HTMLElement | null>(null)
const svgRef = ref<SVGElement | null>(null)
const vw = ref(1200)
const vh = ref(760)
const view = ref({ x: 0, y: 0, k: 1 })
let moved = false

function clamp(v: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, v)) }
function fit() {
  const pad = 40
  const k = clamp(Math.min((vw.value - pad * 2) / CW, (vh.value - pad * 2) / CH), 0.42, 1.25)
  view.value = { k, x: (vw.value - CW * k) / 2, y: Math.max(pad, (vh.value - CH * k) / 2 - 4) }
}
function zoomBy(f: number) {
  const cx = vw.value / 2, cy = vh.value / 2
  const old = view.value.k
  const nk = clamp(old * f, 0.35, 2.2)
  const wx = (cx - view.value.x) / old, wy = (cy - view.value.y) / old
  view.value = { k: nk, x: cx - wx * nk, y: cy - wy * nk }
}
function onWheel(e: WheelEvent) {
  const rect = svgRef.value?.getBoundingClientRect()
  if (!rect) return
  const cx = e.clientX - rect.left, cy = e.clientY - rect.top
  const old = view.value.k
  const nk = clamp(old * Math.exp(-e.deltaY * 0.0015), 0.35, 2.2)
  const wx = (cx - view.value.x) / old, wy = (cy - view.value.y) / old
  view.value = { k: nk, x: cx - wx * nk, y: cy - wy * nk }
}

let dragging = false
let startX = 0, startY = 0, baseX = 0, baseY = 0
function onDown(e: PointerEvent) {
  dragging = true
  moved = false
  startX = e.clientX; startY = e.clientY
  baseX = view.value.x; baseY = view.value.y
  window.addEventListener('pointermove', onMove)
  window.addEventListener('pointerup', onUp)
}
function onMove(e: PointerEvent) {
  if (!dragging) return
  const dx = e.clientX - startX, dy = e.clientY - startY
  if (Math.abs(dx) + Math.abs(dy) > 4) moved = true
  view.value = { ...view.value, x: baseX + dx, y: baseY + dy }
}
function onUp() {
  dragging = false
  window.removeEventListener('pointermove', onMove)
  window.removeEventListener('pointerup', onUp)
  setTimeout(() => { moved = false }, 30)
}

const isFullscreen = ref(false)
function toggleFullscreen() {
  const el = stageRef.value
  if (!el) return
  if (!document.fullscreenElement) el.requestFullscreen?.()
  else document.exitFullscreen?.()
}
function onFsChange() { isFullscreen.value = !!document.fullscreenElement }

let ro: ResizeObserver | null = null
function measure() {
  const el = stageRef.value
  if (!el) return
  vw.value = el.clientWidth
  vh.value = el.clientHeight
}
onMounted(() => {
  measure()
  fit()
  if (window.ResizeObserver && stageRef.value) {
    ro = new ResizeObserver(() => { measure(); fit() })
    ro.observe(stageRef.value)
  }
  document.addEventListener('fullscreenchange', onFsChange)
})
onBeforeUnmount(() => {
  ro?.disconnect()
  window.removeEventListener('pointermove', onMove)
  window.removeEventListener('pointerup', onUp)
  document.removeEventListener('fullscreenchange', onFsChange)
})
</script>

<style scoped lang="scss">
.nkm {
  --navy: #16345c;
  --gold: #f59f00;
  position: relative;
  height: 100%;
  overflow: hidden;
  background:
    radial-gradient(900px 520px at 50% -120px, #eaf2fb 0%, rgba(234, 242, 251, 0) 70%),
    linear-gradient(180deg, #fbfdff 0%, #eff4fb 100%);
  color: #23364d;

  /* 细点状纸纹，营造"手绘画布"氛围 */
  &::before {
    content: '';
    position: absolute; inset: 0;
    background-image: radial-gradient(rgba(22, 52, 92, 0.05) 1px, transparent 1px);
    background-size: 22px 22px;
    pointer-events: none;
  }
}

.nkm-canvas { position: absolute; inset: 0; cursor: grab; touch-action: none; display: block; }
.nkm-canvas:active { cursor: grabbing; }

/* ===== 连线 ===== */
.lnk { fill: none; transition: opacity 0.18s, stroke-width 0.18s; }
.lnk.branch { stroke-width: 1.3; opacity: 0.4; }
.lnk.cross { stroke-width: 1.7; opacity: 0.72; }
.lnk.intra { stroke-width: 1.4; opacity: 0.85; }
.lnk.faint { opacity: 0.08; }
.lnk.hi { opacity: 1; stroke-width: 2.6; }

.lnk.t-flow { stroke: var(--gold); }
.lnk.t-dep { stroke: #2f9e44; stroke-dasharray: 1 0; }
.lnk.t-rel { stroke: #4c6ef5; stroke-dasharray: 5 4; stroke-linecap: round; }
.lnk.cross.chain {
  stroke: var(--gold);
  stroke-width: 2.8;
  opacity: 0.95;
  filter: url(#goldglow);
  stroke-dasharray: 2 7;
  animation: flow 0.9s linear infinite;
}
.lnk.intra.t-flow { stroke: var(--gold); }
@keyframes flow { to { stroke-dashoffset: -18; } }

/* ===== 节点 ===== */
.node { cursor: pointer; }
.node.root rect { fill: var(--navy); stroke: #0d2340; stroke-width: 1.5; }
.node.root .rt-t { fill: #fff; font-size: 17px; font-weight: 800; letter-spacing: 0.04em; }
.node.root .rt-s { fill: #a9c6ea; font-size: 9px; letter-spacing: 0.08em; }

.node.layer rect { stroke: rgba(255, 255, 255, 0.6); stroke-width: 1.4; }
.node.layer .ly-t { fill: #fff; font-size: 13.5px; font-weight: 800; letter-spacing: 0.02em; }
.node.layer .ly-s { fill: rgba(255, 255, 255, 0.85); font-size: 9.5px; }

.node.concept rect { fill: #fff; stroke-width: 1.6; transition: fill 0.15s; }
.node.concept .cn-t { fill: #23364d; font-weight: 600; }
.node.concept .cn-star { fill: #e8930c; font-weight: 800; }
.node.concept.star rect { fill: #fffdf3; stroke-width: 2.2; filter: url(#soft); }
.node.concept:hover rect { fill: #f4f9ff; }
.node.concept.star:hover rect { fill: #fff7e1; }
.node.concept.sel rect { stroke-width: 3; fill: #eef6ff; }
.node.concept.faint { opacity: 0.22; }

/* ===== 极简标题 ===== */
.nkm-title {
  position: absolute; top: 14px; left: 18px; max-width: 46%;
  b { display: block; font-size: 15px; color: var(--navy); font-weight: 800; letter-spacing: 0.02em; }
  span { display: block; margin-top: 3px; font-size: 11px; color: #8395ab; line-height: 1.4; }
}

/* ===== 图例 ===== */
.nkm-legend {
  position: absolute; top: 14px; right: 16px;
  background: rgba(255, 255, 255, 0.82); backdrop-filter: blur(3px);
  border: 1px solid #e2ebf4; border-radius: 10px; padding: 8px 11px;
  box-shadow: 0 6px 16px rgba(13, 33, 55, 0.08);
  .lg-row { display: flex; align-items: center; gap: 7px; font-size: 11px; color: #4a5e76; line-height: 1.9; }
  .lg-swatch { width: 12px; height: 12px; border-radius: 3px; background: linear-gradient(90deg, #7048e8, #0ca678, #1c7ed6, #e8590c, #d6336c, #4263eb, #64707d); }
  .lg-line { width: 22px; height: 0; }
  .lg-line.flow { border-top: 3px solid var(--gold); }
  .lg-line.dep { border-top: 2px solid #2f9e44; }
  .lg-line.rel { border-top: 2px dashed #4c6ef5; }
  .lg-star { color: #e8930c; font-size: 12px; }
}

/* ===== 缩放工具 ===== */
.nkm-tools {
  position: absolute; right: 16px; bottom: 16px; display: flex; gap: 6px;
  button {
    min-width: 30px; height: 30px; padding: 0 8px; border-radius: 8px; cursor: pointer;
    border: 1px solid #d7e2ef; background: rgba(255, 255, 255, 0.9); color: var(--navy);
    font-size: 15px; font-weight: 700; display: inline-flex; align-items: center; justify-content: center;
    box-shadow: 0 3px 8px rgba(13, 33, 55, 0.08); transition: background 0.15s, transform 0.1s;
    &:hover { background: #eef4fb; }
    &:active { transform: translateY(1px); }
  }
}

/* ===== 悬停/选中提示卡 ===== */
.nkm-tip {
  position: absolute; left: 16px; bottom: 16px; width: 268px;
  background: #fff; border: 1px solid #e2ebf4; border-left-width: 4px; border-radius: 12px;
  padding: 11px 13px; box-shadow: 0 12px 30px rgba(13, 33, 55, 0.16);
  .tp-head { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
  .tp-layer { color: #fff; font-size: 10.5px; font-weight: 700; padding: 2px 8px; border-radius: 7px; }
  .tp-star { font-size: 10.5px; color: #d98b00; background: #fff6e5; border: 1px solid #ffe1a8; border-radius: 9px; padding: 1px 7px; }
  .tp-name { font-size: 15px; font-weight: 800; color: #1f2d3d; }
  .tp-note { font-size: 12px; color: #5b6b7f; line-height: 1.6; margin: 6px 0 0; }
  .tp-rel { margin-top: 9px; }
  .rel-cap { display: block; font-size: 10.5px; color: #93a2b4; margin-bottom: 5px; }
  .rel-chip {
    display: inline-block; font-size: 11.5px; color: var(--navy); background: #eef3fa;
    border: 1px solid #dbe6f3; border-left-width: 3px; border-radius: 7px; padding: 1px 8px; margin: 0 6px 6px 0; cursor: pointer;
    &:hover { background: #d9e6f5; }
  }
  .tp-jump {
    display: inline-block; margin-top: 8px; font-size: 12px; font-weight: 700; color: #1c7ed6;
    cursor: pointer; &:hover { text-decoration: underline; }
  }
}
.pop-enter-active, .pop-leave-active { transition: opacity 0.16s, transform 0.16s; }
.pop-enter-from, .pop-leave-to { opacity: 0; transform: translateY(8px); }
</style>
