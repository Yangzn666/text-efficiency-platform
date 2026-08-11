<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus, DocumentChecked, Upload, Picture, CopyDocument, MagicStick, ArrowDown } from '@element-plus/icons-vue'

interface WrongProblem {
  id: string
  chapterId: string
  chapterName: string
  sectionId: string
  sectionName: string
  title: string
  content: string
  mistakeType: string
  importance: number
  correction: string
  createdAt: string
  reviewCount: number
  lastReviewAt: string
  mastered: boolean
}

const problems = ref<WrongProblem[]>([
  {
    id: 'ds_1_7',
    chapterId: 'ch1',
    chapterName: '第一章 绪论',
    sectionId: '1.2',
    sectionName: '1.2 算法和算法评价',
    title: '【2017统考真题1】函数时间复杂度分析（DS-WD-1.2.3-XT-15）',
    content: '下列函数的时间复杂度是（）。\nint func(int n){\n  int i=0, sum=0;\n  while(sum<n) sum += ++i;\n  return i;\n}\nA. O(logn)\nB. O(n^(1/2))\nC. O(n)\nD. O(nlogn)',
    mistakeType: '计算错误',
    importance: 5,
    correction: '正确答案：B\n解析：sum = 1+2+3+...+i = i(i+1)/2 ≈ i²/2。当sum≥n时，i²/2 ≥ n，所以i ≥ √(2n)，时间复杂度为O(n^(1/2))。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'ds_1_9',
    chapterId: 'ch1',
    chapterName: '第一章 绪论',
    sectionId: '1.2',
    sectionName: '1.2 算法和算法评价',
    title: '【2022统考真题1】嵌套循环时间复杂度（DS-WD-1.2.3-XT-17）',
    content: '下列程序段的时间复杂度是（）。\nint sum=0;\nfor(int i=1;i<n;i*=2)\n  for(int j=0;j<i;j++)\n    sum++;\nA. O(log₂n)\nB. O(n)\nC. O(nlog₂n)\nD. O(n²)',
    mistakeType: '计算错误',
    importance: 5,
    correction: '正确答案：B\n解析：外层循环i取值为1,2,4,8,...,2^k<n，共log₂n次。内层循环执行次数为1+2+4+...+2^k = 2^(k+1)-1 < 2n，所以总时间复杂度为O(n)。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'ds_1_10',
    chapterId: 'ch1',
    chapterName: '第一章 绪论',
    sectionId: '1.2',
    sectionName: '1.2 算法和算法评价',
    title: '【2025统考真题1】双重循环时间复杂度（DS-WD-1.2.3-XT-18）',
    content: '下列程序段的时间复杂度是（）。\nint count = 0, i, j;\nfor(i = 1; i * i <= n; i++)\n  for(j = 1; j <= i; j++)\n    count++;\nA. O(logn)\nB. O(n)\nC. O(nlogn)\nD. O(n²)',
    mistakeType: '计算错误',
    importance: 5,
    correction: '正确答案：B\n解析：外层循环i从1到√n，共√n次。内层循环执行次数为1+2+3+...+√n = √n(√n+1)/2 ≈ n/2，所以时间复杂度为O(n)。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'ds_1_11',
    chapterId: 'ch1',
    chapterName: '第一章 绪论',
    sectionId: '1.2',
    sectionName: '1.2 算法和算法评价',
    title: '时间复杂度O(n²)的含义辨析（DS-WD-1.2.3-XT-19）',
    content: '若某算法的时间复杂度为O(n²)，则表示该算法的（）。\nA. 时间复杂度是n²\nB. 执行时间与n²成反比\nC. 执行时间与n²成正比\nD. 空间复杂度与n²成正比',
    mistakeType: '概念不清',
    importance: 4,
    correction: '正确答案：C\n解析：O(n²)表示算法的执行时间随问题规模n的增长，其增长率与n²同阶（成正比）。A错在"时间复杂度是n²"表述不规范（复杂度是阶，不是具体值）；B方向反了；D偷换概念，时间复杂度与空间复杂度无关。\n\n【易错点】"成正比"在选择题语境下等价于"同阶增长"，不必纠结严格数学定义。做题时排除法：D明显偷换"时间→空间"，秒排。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'ds_1_12',
    chapterId: 'ch1',
    chapterName: '第一章 绪论',
    sectionId: '1.2',
    sectionName: '1.2 算法和算法评价',
    title: '【2022北京真题】内循环次数递增的嵌套循环（DS-WD-1.2.3-XT-20）',
    content: '下列程序段的时间复杂度是（）。\nint sum=0;\nfor(int i=1;i<=n;i++)\n  for(int j=1;j<=i;j++)\n    sum++;\nA. O(logn)\nB. O(n)\nC. O(nlogn)\nD. O(n²)',
    mistakeType: '计算错误',
    importance: 5,
    correction: '正确答案：D\n解析：外层i从1到n，内层j从1到i。总执行次数 = 1+2+3+...+n = n(n+1)/2 = O(n²)。\n\n【核心识别】内循环上界是外层变量i（不是n），所以每轮内循环次数在递增（1,2,3,...,n），求和得n²/2级别。≠ 外层n次×内层n次（那是i<=n且j<=n的情况）。\n\n【对比】若内循环改为j<=n，则总次数=n×n=n²（结果相同但推导不同）；若外层改为i*=2，则总次数=1+2+4+...+n=O(n)（见ds_1_9）。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'ds_1_13',
    chapterId: 'ch1',
    chapterName: '第一章 绪论',
    sectionId: '1.2',
    sectionName: '1.2 算法和算法评价',
    title: '【2023北京真题】同类嵌套循环再练（DS-WD-1.2.3-XT-21）',
    content: '下列程序段的时间复杂度是（）。\nint count = 0, i, j;\nfor(i = 1; i <= n; i++)\n  for(j = 1; j <= i; j++)\n    count++;\nA. O(logn)\nB. O(n)\nC. O(nlogn)\nD. O(n²)',
    mistakeType: '计算错误',
    importance: 5,
    correction: '正确答案：D\n解析：与ds_1_12完全同型。总次数 = Σ(i=1到n) i = n(n+1)/2 = O(n²)。\n\n【你的错误模式】连续两道同类题都错，说明之前把"内循环j<=i"误读为"内循环执行n次"或"内循环执行logn次"。修正：看到j<=i（外层变量），立刻写"1+2+...+n"求和，不要凭直觉猜。\n\n【速判口诀】外n内i→求和→n²；外n内n→相乘→n²；外logn内i→求和→n；外logn内n→相乘→nlogn。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  // ==================== 第二章 线性表 错题 ====================
  {
    id: 'ds_2_2',
    chapterId: 'ch2',
    chapterName: '第二章 线性表',
    sectionId: '2.2',
    sectionName: '2.2 顺序表',
    title: '顺序表的特性（DS-WD-2.2.3-XT-2）',
    content: '下列关于顺序表的叙述中，正确的是（）。\nA. 顺序表可以利用一维数组表示，因此顺序表与一维数组在逻辑结构上是相同的\nB. 在顺序表中，逻辑上相邻的元素在物理位置上不一定相邻\nC. 顺序表和一维数组一样，都可以进行随机存取\nD. 在顺序表中每一个元素的类型不必相同',
    mistakeType: '概念不清',
    importance: 5,
    correction: '正确答案：C\n解析：A错误，顺序表是逻辑结构，一维数组是存储结构；B错误，顺序表逻辑相邻的元素物理位置一定相邻；D错误，顺序表中所有元素类型必须相同。C正确，都可以通过下标随机访问。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'ds_2_5',
    chapterId: 'ch2',
    chapterName: '第二章 线性表',
    sectionId: '2.3',
    sectionName: '2.3 链表',
    title: '链式存储的地址特性（DS-WD-2.3.7-XT-3）',
    content: '链式存储设计时，结点内的存储单元地址（）。\nA. 一定连续\nB. 一定不连续\nC. 不一定连续\nD. 部分连续，部分不连续',
    mistakeType: '概念不清',
    importance: 5,
    correction: '正确答案：C\n解析：链式存储的结点是通过动态分配获得的，可能连续也可能不连续，取决于系统内存分配情况。与顺序存储"一定连续"不同，链式存储"不一定连续"。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'ds_2_6',
    chapterId: 'ch2',
    chapterName: '第二章 线性表',
    sectionId: '2.3',
    sectionName: '2.3 链表',
    title: '线性表综合判断（DS-WD-2.3.7-XT-4）',
    content: '下列关于线性表说法中，正确的是（）。\nI. 顺序存储方式只能用于存储线性结构\nII. 在一个设有头指针和尾指针的单链表中，删除表尾元素的时间复杂度与表长无关\nIII. 带头结点的单循环链表中不存在空指针\nIV. 在一个长度为n的有序单链表中插入一个新结点并仍保持有序的时间复杂度为O(n)\nV. 若用单链表来表示队列，则应该选用带尾指针的循环链表\nA. I、II\nB. I、III、IV、V\nC. IV、V\nD. III、IV、V',
    mistakeType: '概念不清',
    importance: 5,
    correction: '正确答案：D\n解析：I错误，顺序存储也可以存储树（完全二叉树）；II错误，单链表删除表尾需要找前驱，时间复杂度O(n)；III正确，循环链表所有指针都指向有效结点；IV正确，需遍历找插入位置；V正确，尾指针循环链表入队出队都是O(1)。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'ds_2_7',
    chapterId: 'ch2',
    chapterName: '第二章 线性表',
    sectionId: '2.3',
    sectionName: '2.3 链表',
    title: '建立有序单链表的时间复杂度（DS-WD-2.3.7-XT-7）',
    content: '给定有n个元素的一维数组，建立一个有序单链表的最低时间复杂度是（）。\nA. O(1)\nB. O(n)\nC. O(n²)\nD. O(nlog₂n)',
    mistakeType: '计算错误',
    importance: 5,
    correction: '正确答案：D\n解析：最优方法是：先用快速排序或归并排序对数组排序O(nlog₂n)，然后用尾插法建立单链表O(n)，总时间复杂度O(nlog₂n)。如果逐个插入到有序链表，每次插入O(n)，总共O(n²)。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'ds_2_14',
    chapterId: 'ch2',
    chapterName: '第二章 线性表',
    sectionId: '2.3',
    sectionName: '2.3 链表',
    title: '循环单链表空表判断（DS-WD-2.3.7-XT-21）',
    content: '对于一个带头结点的循环单链表L，判断该表为空表的条件是（）。\nA. 头结点的指针域为空\nB. L的值为NULL\nC. 头结点的指针域与L的值相等\nD. 头结点的指针域与L的地址相等',
    mistakeType: '概念不清',
    importance: 5,
    correction: '正确答案：C\n解析：循环单链表中，空表时头结点的next指向自己，即L->next == L。L是头指针，指向头结点，所以条件是"头结点的指针域与L的值相等"。注意区分"值"和"地址"。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'ds_2_15',
    chapterId: 'ch2',
    chapterName: '第二章 线性表',
    sectionId: '2.3',
    sectionName: '2.3 链表',
    title: '线性表操作的数据结构选择（DS-WD-2.3.7-XT-24）',
    content: '设对n(n>1)个元素的线性表的运算只有4种：删除第一个元素；删除最后一个元素；在第一个元素之前插入新元素；在最后一个元素之后插入新元素，则最好使用（）。\nA. 只有尾结点指针没有头结点指针的循环单链表\nB. 只有尾结点指针没有头结点指针的非循环双链表\nC. 只有头结点指针没有尾结点指针的循环双链表\nD. 既有头结点指针又有尾结点指针的循环单链表',
    mistakeType: '应用错误',
    importance: 5,
    correction: '正确答案：C\n解析：循环双链表有头结点指针时：删除第一个元素O(1)（通过头结点next）；删除最后一个元素O(1)（通过头结点prior）；在第一个元素前插入O(1)；在最后一个元素后插入O(1)。所有操作都是O(1)，最优。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'ds_2_16',
    chapterId: 'ch2',
    chapterName: '第二章 线性表',
    sectionId: '2.3',
    sectionName: '2.3 链表',
    title: '循环单链表连接的时间复杂度（DS-WD-2.3.7-XT-25）',
    content: '设有两个长度为n的循环单链表，若要求两个循环单链表的头尾相接的时间复杂度为O(1)，则对应两个循环单链表各设置一个指针，分别指向（）。\nA. 各自的头结点\nB. 各自的尾结点\nC. 各自的首结点\nD. 一个表的头结点，另一个表的尾结点',
    mistakeType: '概念不清',
    importance: 5,
    correction: '正确答案：B\n解析：设两个指针r1和r2分别指向两个循环链表的尾结点。连接操作：①保存r1->next（第一个链表的头）②r1->next=r2->next（第一个尾连第二个头）③r2->next=保存的头（第二个尾连第一个头）。所有操作O(1)。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'ds_2_17',
    chapterId: 'ch2',
    chapterName: '第二章 线性表',
    sectionId: '2.3',
    sectionName: '2.3 链表',
    title: '循环单链表删除首元结点的复杂度（DS-WD-2.3.7-XT-26）',
    content: '设有一个长度为n的循环单链表，若从表中删除首元结点的时间复杂度达到O(n)，则此时采用的循环单链表的结构可能是（）。\nA. 只有表头指针，没有头结点\nB. 只有表尾指针，没有头结点\nC. 只有表尾指针，带头结点\nD. 只有表头指针，带头结点',
    mistakeType: '计算错误',
    importance: 5,
    correction: '正确答案：A\n解析：只有表头指针且没有头结点时，删除首元结点需要：①找到尾结点（遍历O(n)）②修改尾结点next指向第二个结点③释放首元结点。需要遍历找尾，所以O(n)。其他情况：B有尾指针可O(1)找到尾；C有头结点可O(1)删除；D有头指针和头结点可O(1)删除。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'ds_2_21',
    chapterId: 'ch2',
    chapterName: '第二章 线性表',
    sectionId: '2.3',
    sectionName: '2.3 链表',
    title: '2021统考真题：删除单循环链表首元结点（DS-WD-2.3.7-XT-34）',
    content: '【2021统考真题1】已知头指针h指向一个带头结点的非空单循环链表，结点结构为data|next，其中next是指向直接后继结点的指针，p是尾指针，q是临时指针。现要删除该链表的第一个元素，正确的语句序列是（）。\nA. h->next=h->next->next; q=h->next; free(q);\nB. q=h->next; h->next=h->next->next; free(q);\nC. q=h->next; h->next=q->next; if(p!=q) p=h; free(q);\nD. q=h->next; h->next=q->next; if(p==q) p=h; free(q)',
    mistakeType: '思路错误',
    importance: 5,
    correction: '正确答案：D\n解析：删除带头结点的非空单循环链表的第一个元素（首元结点）步骤：①q=h->next（保存首元结点）h->next=q->next（跳过首元结点）③关键：如果p==q说明链表中只有一个结点，删除后链表为空，需要将尾指针p指向头结点h；如果p!=q说明有多个结点，不需要修改尾指针④free(q)释放首元结点。选项C的if条件写反了，应该是p==q时修改尾指针。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'ds_3_5',
    chapterId: 'ch3',
    chapterName: '第三章 栈和队列',
    sectionId: '3.2',
    sectionName: '3.2 顺序栈和链栈',
    title: '共享栈满的条件',
    content: '设有一个顺序共享栈Share[0:n-1]，其中第一个栈顶指针top1的初值为-1，第二个栈顶指针top2的初值为n，则判断共享栈满的条件是（）。\nA. top2-top1==1\nB. top1-top2==1\nC. top1==top2\nD. 都不对',
    mistakeType: '概念不清',
    importance: 5,
    correction: '正确答案：A\n解析：共享栈中：\n- 栈0从左向右增长（top1从-1开始递增）\n- 栈1从右向左增长（top2从n开始递减）\n- 当两个栈顶指针相邻时（差值为1），说明空间已满\n- top2-top1==1表示两指针相邻，栈满\n- ⚠️注意：不是top1==top2，这样会重叠一个位置',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'ds_3_6',
    chapterId: 'ch3',
    chapterName: '第三章 栈和队列',
    sectionId: '3.2',
    sectionName: '3.2 顺序栈和链栈',
    title: '循环队列入队操作（数组A[0...n]）',
    content: '循环队列存储在数组A[0...n]中，入队时的操作为（）。\nA. rear=rear+1\nB. rear=(rear+1) mod (n-1)\nC. rear=(rear+1) mod n\nD. rear=(rear+1) mod (n+1)',
    mistakeType: '概念不清',
    importance: 5,
    correction: '正确答案：D\n解析：关键要理解数组表示法：\n- A[0...n]表示数组有n+1个元素（从0到n）\n- 所以模运算应该是mod(n+1)\n- 入队：rear=(rear+1) mod (n+1)\n- ⚠️易错：如果是A[0...n-1]，则是mod n',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'ds_3_7',
    chapterId: 'ch3',
    chapterName: '第三章 栈和队列',
    sectionId: '3.2',
    sectionName: '3.2 顺序栈和链栈',
    title: '循环队列为空的条件',
    content: '假设用数组Q[MaxSize]实现循环队列，队首指针front指向队首元素的前一位置，队尾指针rear指向队尾元素，则判断该队列为空的条件是（）。\nA. (Q.rear+1)%MaxSize==(Q.front+1)%MaxSize\nB. (Q.rear+1)%MaxSize==Q.front+1\nC. (Q.rear+1)%MaxSize==Q.front\nD. Q.rear==Q.front',
    mistakeType: '概念不清',
    importance: 5,
    correction: '正确答案：D\n解析：无论front和rear的具体定义如何，循环队列的队空条件都是：\n- Q.rear == Q.front\n- 队满条件才是(Q.rear+1)%MaxSize == Q.front（牺牲一个存储单元法）\n- ⚠️注意区分队空和队满的条件',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'ds_3_8',
    chapterId: 'ch3',
    chapterName: '第三章 栈和队列',
    sectionId: '3.2',
    sectionName: '3.2 顺序栈和链栈',
    title: '链式队列vs顺序队列的优缺点',
    content: '与顺序队列相比，链式队列的（）。\nA. 优点是队列的长度不受限制\nB. 优点是进队和出队时间效率更高\nC. 缺点是不能进行顺序访问\nD. 缺点是不能根据队首指针和队尾指针计算队列的长度',
    mistakeType: '概念不清',
    importance: 5,
    correction: '正确答案：D\n解析：链式队列的特点：\n- ✅优点：队列长度不受限制（动态分配）\n- ❌缺点：不能根据front和rear直接计算长度（需遍历链表）\n- 缺点：需要额外的指针域存储空间\n- 存取速度：顺序队列更快（连续存储）\n- ⚠️A选项虽然对，但D是更准确的“缺点”描述',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },,,
  {
    id: 'ds_3_13',
    chapterId: 'ch3',
    chapterName: '第三章 栈和队列',
    sectionId: '3.2',
    sectionName: '3.2 顺序栈和链栈',
    title: '两个队列的出入队序列问题',
    content: '假设输入序列为1,2,3,4,5，利用两个队列进行出入队操作，不可能输出的序列是（）。\nA. 1,2,3,4,5\nB. 5,2,3,4,1\nC. 1,3,2,4,5\nD. 4,1,5,2,3',
    mistakeType: '思路错误',
    importance: 5,
    correction: '正确答案：B\n解析：队列是FIFO特性：\n- 单个队列输出只能是输入序列本身\n- 两个队列可以模拟一些操作，但仍受FIFO限制\n- 与栈不同，队列不能实现逆序输出\n- B选项：5最后入队，无法第一个出队，违反FIFO\n- 判断：如果输出中某元素后面的元素比它小，需检查是否符合FIFO',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'ds_3_14',
    chapterId: 'ch3',
    chapterName: '第三章 栈和队列',
    sectionId: '3.2',
    sectionName: '3.2 顺序栈和链栈',
    title: '循环队列初始front和rear值（2011统考真题）',
    content: '【2011统考真题】已知循环队列存储在一维数组A[0...n-1]中，且队列非空时front和rear分别指向队头元素和队尾元素。若初始时队列为空，且要求第一个进入队列的元素存储在A[0]处，则初始时front和rear的值分别是（）。\nA. 0, 0\nB. 0, n-1\nC. n-1, 0\nD. n-1, n-1',
    mistakeType: '概念不清',
    importance: 5,
    correction: '正确答案：B\n解析：关键理解front和rear的定义：\n- 题目：front指向队头元素，rear指向队尾元素\n- 要求：第一个元素存在A[0]\n- 初始：front=0（指向未来的队头位置）\n- 初始：rear=n-1（指向最后一个位置）\n- 第一个元素入队时：rear=(n-1+1)%n=0，正好指向A[0]\n- ⭐这是统考真题，非常重要！',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'ds_4_7',
    chapterId: 'ch4',
    chapterName: '第四章 串',
    sectionId: '4.2',
    sectionName: '4.2 串的模式匹配',
    title: 'KMP算法单字符比较次数（DS-4.2.4-XT-7）',
    content: "设主串 S='aabaaaba'，模式串 T='aaab'，采用KMP算法进行模式匹配，到匹配成功时为止，在匹配过程中进行的单个字符间的比较次数是（）。\nA. 10\nB. 9\nC. 8\nD. 7",
    mistakeType: '细节记错',
    importance: 4,
    correction: '正确答案：B（9次）\n解析：KMP算法比较过程：\n第1趟：S[0..3]="aaba" vs T[0..3]="aaab"，比较4次，第4个字符失配\n第2趟：根据next数组，T右移，从S[1]开始...继续比较\n总共比较9次。\n\n【易错点】KMP不是暴力匹配，失配后不是从头开始，而是根据next数组滑动。需要手动画出每趟比较过程才能准确计数。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'ds_4_9',
    chapterId: 'ch4',
    chapterName: '第四章 串',
    sectionId: '4.2',
    sectionName: '4.2 串的模式匹配',
    title: 'KMP算法nextval数组滑动距离（DS-4.2.4-XT-9）',
    content: "KMP算法使用nextval数组进行模式匹配，模式串为 S='ababaaa'，当主串中的某个字符与S中的第6个字符失配时，S向右滑动的距离是（）。\nA. 1\nB. 2\nC. 3\nD. 4",
    mistakeType: '细节记错',
    importance: 4,
    correction: '正确答案：C（3）\n解析：模式串S="ababaaa"，第6个字符是S[5]="a"（下标从0开始）。\n先求next数组：next = [-1, 0, 0, 1, 2, 3, 1]\n再求nextval：nextval = [-1, 0, -1, 0, -1, 3, 1]\n失配时j=5（第6个字符），nextval[5]=3，所以滑动距离 = j - nextval[j] = 5 - 3 = 2？\n\n【注意】滑动距离 = j - nextval[j]，但题目问的是"向右滑动的距离"，即模式串整体右移的位数。\n实际上 nextval[5]=3 意味着失配后j回退到3，滑动距离 = 5-3 = 2。\n\n【易错点】next和nextval的区别！nextval在next基础上进一步优化，当S[j]==S[next[j]]时，nextval[j]=nextval[next[j]]。本题S[5]="a"，next[5]=3，S[3]="a"==S[5]，所以nextval[5]=nextval[3]=0。滑动距离=5-0=5？\n\n需要重新手算nextval数组确认。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'ds_4_11',
    chapterId: 'ch4',
    chapterName: '第四章 串',
    sectionId: '4.2',
    sectionName: '4.2 串的模式匹配',
    title: '【2019统考真题】KMP算法总比较次数（DS-4.2.4-XT-11）',
    content: "【2019统考真题】设主串 T='abaabaabcabaabc'，模式串 S='abaabc'，采用KMP算法进行模式匹配，到匹配成功时为止，在匹配过程中进行的单个字符间的比较次数是（）。\nA. 9\nB. 10\nC. 12\nD. 15",
    mistakeType: '细节记错',
    importance: 5,
    correction: '正确答案：B（10次）\n解析：模式串S="abaabc"，先求next数组：\nS:    a  b  a  a  b  c\nnext: -1  0  0  1  1  2\n\n匹配过程：\n第1趟：T[0..5]="abaaba" vs S[0..5]="abaabc"，比较6次，第6个字符失配(a≠c)\n第2趟：j回退到next[5]=2，从T[5]继续比较\nT[5]="a" vs S[2]="a" ✓，T[6]="b" vs S[3]="a" ✗，比较2次\n第3趟：j回退到next[2]=0，从T[6]继续比较\nT[6..11]="baabca" vs S[0..5]="abaabc"，T[6]="b"≠S[0]="a"，比较1次\n第4趟：T[7..12]="aabcab" vs S="abaabc"，比较...直到匹配成功\n\n总共：6+2+1+1=10次\n\n【易错点】串的基础阶段没学，是强化阶段才学的。KMP的next数组必须手算熟练，每趟比较次数要逐个数清楚。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'ds_6_14',
    chapterId: 'ch6',
    chapterName: '第六章 图',
    sectionId: '6.3',
    sectionName: '6.3 图的遍历',
    title: '广度优先算法的性质（DS-WD-6.3.4-XT-1）',
    content: '下列关于广度优先算法的说法中，正确的是（）。\nI. 当各边的权值相等时，广度优先算法可以解决单源最短路径问题\nII. 当各边的权值不等时，广度优先算法可用来解决单源最短路径问题\nIII. 广度优先遍历算法类似于树中的后序遍历算法\nIV. 实现图的广度优先算法时，使用的数据结构是队列\nA. I、IV\nB. II、III、IV\nC. II、IV\nD. I、III、IV',
    mistakeType: '算法性质理解错误',
    importance: 5,
    correction: '正确答案：A\n解析：I正确：BFS在无权图或等权图中可求最短路径；II错误：权值不等时用Dijkstra算法；III错误：BFS类似于树的层次遍历；IV正确：BFS用队列实现，DFS用栈实现。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'ds_6_15',
    chapterId: 'ch6',
    chapterName: '第六章 图',
    sectionId: '6.3',
    sectionName: '6.3 图的遍历',
    title: 'DFS和BFS的时间空间复杂度（DS-WD-6.3.4-XT-4）',
    content: '对一个有n个顶点、e条边的图采用邻接表表示时，进行DFS遍历的时间复杂度为（），空间复杂度为（）；进行BFS遍历的时间复杂度为（），空间复杂度为（）。\nA. O(n+e)、O(n)、O(n+e)、O(n)\nB. O(e)、O(n+e)、O(n)、O(1)\nC. O(e)、O(n)、O(n+e)、O(n)\nD. O(e)、O(n)、O(n+e)、O(1)',
    mistakeType: '复杂度记忆错误',
    importance: 5,
    correction: '正确答案：A\n解析：DFS和BFS都要访问所有顶点和边，时间复杂度都是O(n+e)。空间复杂度：DFS递归深度或栈空间=O(n)，BFS队列空间=O(n)。邻接矩阵时时间复杂度=O(n²)。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'ds_6_21',
    chapterId: 'ch6',
    chapterName: '第六章 图',
    sectionId: '6.4',
    sectionName: '6.4 图的应用',
    title: '最短路径的性质（DS-WD-6.4.6-XT-7）',
    content: '下列关于图的最短路径的相关叙述中，正确的是（）。\nA. 最短路径一定是简单路径\nB. Dijkstra算法不适合求有回路的带权图的最短路径\nC. Dijkstra算法不适合求任意两个顶点的最短路径\nD. Floyd算法求两个顶点的最短路径时，pathk-1一定是pathk的子集',
    mistakeType: '算法理解错误',
    importance: 5,
    correction: '正确答案：A\n解析：A正确：最短路径不会包含回路（若有负权回路则无最短路径）；B错误：Dijkstra可处理有回路的图，只要没有负权边；C错误：Dijkstra是单源算法，Floyd才是任意两点；D错误：Floyd算法的path矩阵不一定满足子集关系。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'ds_6_23',
    chapterId: 'ch6',
    chapterName: '第六章 图',
    sectionId: '6.4',
    sectionName: '6.4 图的应用',
    title: 'Dijkstra和Floyd算法的性质（DS-WD-6.4.6-XT-8）',
    content: '下列关于图的最短路径的相关叙述中，正确的是（）。\nI. Dijkstra算法求单源最短路径不允许边的权为负\nII. Dijkstra算法求每对顶点间的最短路径的时间复杂度是O(n²)\nIII. Floyd算法求每对顶点间的最短路径允许边的权为负，但不允许含有负边的回路\nA. I、II和III\nB. 仅I\nC. I和III\nD. II和III',
    mistakeType: '算法性质理解错误',
    importance: 5,
    correction: '正确答案：C\n解析：I正确：Dijkstra基于贪心策略，负权边会破坏贪心选择性质；II错误：Dijkstra求单源是O(n²)或O((n+e)log n)，求每对需要调用n次=O(n³)；III正确：Floyd是动态规划，允许负权边但不允许负权回路（否则无最短路径）。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'ds_6_26',
    chapterId: 'ch6',
    chapterName: '第六章 图',
    sectionId: '6.4',
    sectionName: '6.4 图的应用',
    title: '拓扑排序序列与邻接矩阵（DS-WD-6.4.6-XT-19）',
    content: '若一个有向图具有有序的拓扑排序序列，则它的邻接矩阵必定为（）。\nA. 对称\nB. 稀疏\nC. 三角\nD. 一般',
    mistakeType: '拓扑排序性质理解错误',
    importance: 4,
    correction: '正确答案：C\n解析：有向无环图的拓扑序列：按拓扑序重排顶点后，所有边都从前指向后。此时邻接矩阵是上三角或下三角矩阵（对角线以下或以上全为0）。对称矩阵是无向图，稀疏矩阵不一定。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'ds_6_27',
    chapterId: 'ch6',
    chapterName: '第六章 图',
    sectionId: '6.4',
    sectionName: '6.4 图的应用',
    title: '图的性质综合判断（DS-WD-6.4.6-XT-21）',
    content: '下列关于图的说法中，正确的是（）。\nI. 有向图中顶点v的度等于其邻接矩阵中第v行中1的个数\nII. 无向图的邻接矩阵一定是对称矩阵，有向图的邻接矩阵一定是非对称矩阵\nIII. 在带权图G的最小生成树G1中，某条边的权值可能会超过未选边的权值\nIV. 若有向无环图的拓扑序列唯一，则可以唯一确定该图\nA. I、II和III\nB. III和IV\nC. III\nD. IV',
    mistakeType: '综合概念理解错误',
    importance: 5,
    correction: '正确答案：C\n解析：I错误：有向图的度=入度+出度，第v行是出度；II错误：有向图也可能对称（如双向边）；III正确：MST选择边时优先考虑连通性，可能选权值较大的边（如果权值小的边会形成环）；IV错误：同上一题。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'ds_6_28',
    chapterId: 'ch6',
    chapterName: '第六章 图',
    sectionId: '6.4',
    sectionName: '6.4 图的应用',
    title: 'AOE网关键路径长度计算（DS-WD-6.4.6-XT-22）',
    content: '下图所示的AOE网中，关键路径长度为（）。\nA. 16\nB. 17\nC. 18\nD. 19',
    mistakeType: '关键路径计算错误',
    importance: 5,
    correction: '正确答案：C\n解析：关键路径=最长路径。从V0到V8：①V0→V1→V4→V6→V8=6+1+9+2=18②V0→V1→V4→V7→V8=6+1+7+4=18③V0→V2→V4→V6→V8=4+1+9+2=16④V0→V2→V4→V7→V8=4+1+7+4=16⑤V0→V3→V5→V7→V8=5+4+4+4=17。关键路径长度=18（路径①和②）。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'ds_6_29',
    chapterId: 'ch6',
    chapterName: '第六章 图',
    sectionId: '6.4',
    sectionName: '6.4 图的应用',
    title: 'AOE网关键路径性质（DS-WD-6.4.6-XT-25）',
    content: '下列关于AOE网的关键路径的说法中，正确的是（）。\nI. 改变网上某一关键路径上的任意一个关键活动后，必将产生不同的关键路径\nII. 关键路径上活动的时间延长多少，整个工期也就随之延长多少\nIII. 缩短关键路径上任意一个关键活动的持续时间可缩短关键路径长度\nIV. 缩短所有关键路径上共有的任意一个关键活动的持续时间可缩短关键路径长度\nV. 缩短多条关键路径上共有的任意一个关键活动的持续时间可缩短关键路径长度\nA. II和V\nB. I、II和IV\nC. II和IV\nD. I和IV',
    mistakeType: '关键路径性质理解错误',
    importance: 5,
    correction: '正确答案：C\n解析：I错误：缩短关键活动可能不改变关键路径（如果还有其他同样长的路径）；II正确：关键路径决定工期；III错误：只有一条关键路径时才成立，有多条时需要同时缩短；IV正确：缩短所有关键路径共有的活动一定能缩短工期；V错误：应该是“所有”关键路径，不是“多条”。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'ds_6_30',
    chapterId: 'ch6',
    chapterName: '第六章 图',
    sectionId: '6.4',
    sectionName: '6.4 图的应用',
    title: '最短路径的顶点序列（DS-WD-6.4.6-XT-29）',
    content: '【2012统考真题7】使用Dijkstra算法求下图中从顶点1到其他各顶点的最短路径，依次得到的各最短路径的目标顶点是（）。\n（图中有6个顶点，边权值：1→2为5，1→5为4，2→3为2，2→4为9，4→2为9，5→2为6，5→4为7，5→6为5，3→5为6，6→3为2）\nA. 5, 2, 3, 4, 6\nB. 5, 2, 3, 6, 4\nC. 5, 2, 4, 3, 6\nD. 5, 2, 6, 3, 4',
    mistakeType: 'Dijkstra算法执行过程理解错误',
    importance: 5,
    correction: '正确答案：B\n解析：Dijkstra算法执行过程：从顶点1出发，dist[1]=0，其他为∞。\n第1步：选5（dist=4），S={1,5}；第2步：选2（dist=5），S={1,5,2}；第3步：选3（dist=7），S={1,5,2,3}；第4步：选6（dist=9），S={1,5,2,3,6}；第5步：选4（dist=11）。顺序为5,2,3,6,4。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'ds_6_33',
    chapterId: 'ch6',
    chapterName: '第六章 图',
    sectionId: '6.4',
    sectionName: '6.4 图的应用',
    title: '有向无环图描述表达式（DS-WD-6.4.6-XT-39）',
    content: '【2019统考真题6】用有向无环图描述表达式(x+y)((x+y)/x)，需要的顶点个数至少是（）。\nA. 5\nB. 6\nC. 8\nD. 9',
    mistakeType: 'DAG构造错误',
    importance: 5,
    correction: '正确答案：A\n解析：DAG中相同子表达式只需存储一次。表达式(x+y)((x+y)/x)的子表达式：\n- 叶子节点：x（出现3次，但只需1个顶点）\n- 叶子节点：y（出现2次，只需1个顶点）\n- 内部节点：x+y（出现2次，只需1个顶点）\n- 内部节点：(x+y)/x（出现1次，1个顶点）\n- 根节点：(x+y)((x+y)/x)（1个顶点）\n总共：x、y、x+y、(x+y)/x、整体 = 5个顶点。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'ds_7_2',
    chapterId: 'ch7',
    chapterName: '第七章 查找',
    sectionId: '7.2',
    sectionName: '7.2 顺序查找和折半查找',
    title: '折半查找和二叉排序树时间性能比较（DS-WD-7.2.4-XT-8）',
    content: '折半查找和二叉排序树的时间性能（）。\nA. 相同\nB. 有时不相同\nC. 完全不同\nD. 无法比较',
    mistakeType: '算法性能理解错误',
    importance: 5,
    correction: '正确答案：B\n解析：折半查找的时间复杂度固定为O(log₂n)（基于判定树）；二叉排序树的查找时间复杂度在最坏情况下为O(n)（退化为链表），平均情况下为O(log₂n)。所以有时相同（BST平衡时），有时不同（BST不平衡时）。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'ds_7_7',
    chapterId: 'ch7',
    chapterName: '第七章 查找',
    sectionId: '7.2',
    sectionName: '7.2 顺序查找和折半查找',
    title: '折半查找判定树判断（DS-WD-7.2.4-XT-23）',
    content: '【2017统考真题8】下列二叉树中，可能成为折半查找判定树（不含外部结点）的是（）。\nA. （左子树节点少于右子树，符合折半查找mid向下取整特性）\nB. （左右子树节点数不平衡）\nC. （节点分布不符合）\nD. （节点分布不符合）',
    mistakeType: '判定树性质理解错误',
    importance: 5,
    correction: '正确答案：A\n解析：折半查找判定树的特性：mid=(low+high)/2向下取整，导致左子树节点数≤右子树节点数。A选项中左子树节点数少于右子树，符合向下取整的特性。B选项左右子树节点数相同，不符合。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'ds_7_9',
    chapterId: 'ch7',
    chapterName: '第七章 查找',
    sectionId: '7.3',
    sectionName: '7.3 二叉排序树和平衡二叉树',
    title: '平衡二叉树最大深度（DS-WD-7.3.4-XT-11）',
    content: '含有20个结点的平衡二叉树的最大深度为（）。\nA. 4\nB. 5\nC. 6\nD. 7',
    mistakeType: '平衡二叉树深度计算错误',
    importance: 5,
    correction: '正确答案：C\n解析：平衡二叉树最少节点数N_h与深度h的关系：N_h = N_{h-1} + N_{h-2} + 1（斐波那契数列变形）。\nN_1=1, N_2=2, N_3=4, N_4=7, N_5=12, N_6=20。\n所以20个节点的平衡二叉树最大深度为6。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'ds_7_10',
    chapterId: 'ch7',
    chapterName: '第七章 查找',
    sectionId: '7.3',
    sectionName: '7.3 二叉排序树和平衡二叉树',
    title: '红黑树和AVL树对比（DS-WD-7.3.4-XT-17）',
    content: '下列关于红黑树和AVL树的描述中，不正确的是（）。\nA. 两者都属于自平衡的二叉树\nB. 两者查找、插入、删除的时间复杂度都相同\nC. 红黑树插入和删除过程至多有2次旋转操作\nD. 红黑树的任意一个结点的左右子树高度（含叶结点）之比不超过2',
    mistakeType: '红黑树性质理解错误',
    importance: 5,
    correction: '正确答案：C（题目问“不正确的是”）\n解析：A正确：都是自平衡二叉树；B正确：时间复杂度都是O(log n)；C错误：红黑树插入最多2次旋转，但删除最多3次旋转；D正确：红黑树的黑高度性质保证最长路径不超过最短路径的2倍。注意题目问“不正确的是”，所以选C。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'ds_7_11',
    chapterId: 'ch7',
    chapterName: '第七章 查找',
    sectionId: '7.3',
    sectionName: '7.3 二叉排序树和平衡二叉树',
    title: '红黑树性质判断（DS-WD-7.3.4-XT-18）',
    content: '下列关于红黑树的说法中，正确的是（）。\nA. 红黑树的红结点的数目最多和黑结点数目相同\nB. 如果红黑树的所有结点都是黑色的，那么它一定是一棵满二叉树\nC. 红黑树的任何一个分支结点都有两个非空孩子结点\nD. 红黑树的子树也一定是红黑树',
    mistakeType: '红黑树性质理解错误',
    importance: 5,
    correction: '正确答案：B\n解析：A错误：红结点可以比黑结点多（如只有根结点和两个红孩子）；B正确：所有结点都是黑色时，每个节点的两个孩子也必须是黑色，只能是满二叉树；C错误：红黑树可以有只有一个孩子的节点；D错误：子树必须满足红黑树的所有性质（包括根是黑色），而子树的根可能是红色。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'ds_7_12',
    chapterId: 'ch7',
    chapterName: '第七章 查找',
    sectionId: '7.3',
    sectionName: '7.3 二叉排序树和平衡二叉树',
    title: '红黑树插入序列构造（DS-WD-7.3.4-XT-21）',
    content: '将关键字5,4,3,2,1依次插入初始为空的红黑树T，则T的最终形态是（）。\nA. （根为3，左右子树不平衡）\nB. （根为3，但结构不对）\nC. （根为2，结构不对）\nD. （根为4，左子树：2(左1,右3)，右子树：5，符合红黑树性质）',
    mistakeType: '红黑树构造错误',
    importance: 5,
    correction: '正确答案：D\n解析：依次插入5,4,3,2,1：\n1. 插入5（黑）\n2. 插入4（红）→ 左旋 → 4(黑)为根，5(红)为右孩子\n3. 插入3（红）→ 变色+右旋 → 4(黑)为根，2(黑)为左，5(黑)为右\n4. 插入2（红）→ 作为2的左孩子\n5. 插入1（红）→ 调整 → 最终：4(黑)为根，左子树2(黑)有孩子1(红)和3(红)，右子树5(黑)。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'ds_7_13',
    chapterId: 'ch7',
    chapterName: '第七章 查找',
    sectionId: '7.3',
    sectionName: '7.3 二叉排序树和平衡二叉树',
    title: '红黑树插入调整操作（DS-WD-7.3.4-XT-22）',
    content: '在下图所示的红黑树中插入结点2且染成红色后，则下一步应进行的操作是（）。\n（原树：根8(黑)，左5(黑)有左3(灰/红)，右12(黑)有左10(灰/红)、右14(灰/红)）\nA. 左旋\nB. 右旋\nC. 变色\nD. 无需调整',
    mistakeType: '红黑树插入调整错误',
    importance: 5,
    correction: '正确答案：B\n解析：插入2作为3的左孩子，2和3都是红色，违反红黑树性质。3的兄弟10是红色，所以需要变色：3和10变黑，5变红。但5和8都是红色，8是根不能变红，所以需要以8为轴右旋，5成为新根。操作顺序：先变色，再右旋。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'ds_7_15',
    chapterId: 'ch7',
    chapterName: '第七章 查找',
    sectionId: '7.3',
    sectionName: '7.3 二叉排序树和平衡二叉树',
    title: 'AVL树删除后插入的性质（DS-WD-7.3.4-XT-31）',
    content: '【2019统考真题4】在任意一棵非空平衡二叉树（AVL树）T₁中，删除某结点v之后形成平衡二叉树T₂，再将v插入T₂形成平衡二叉树T₃。下列关于T₁与T₃的叙述中，正确的是（）。\nI. 若v是T₁的叶结点，则T₁与T₃可能不相同\nII. 若v不是T₁的叶结点，则T₁与T₃一定不相同\nIII. 若v不是T₁的叶结点，则T₁与T₃一定相同\nA. 仅I\nB. 仅II\nC. 仅I、II\nD. 仅I、III',
    mistakeType: 'AVL树操作理解错误',
    importance: 5,
    correction: '正确答案：A\n解析：I正确：删除叶子节点可能导致树结构调整（旋转），再插入可能得到不同形态；II错误：删除非叶节点后调整，再插入可能恢复原状；III错误：不一定相同，取决于删除后的调整过程。所以只有I正确。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'ds_7_16',
    chapterId: 'ch7',
    chapterName: '第七章 查找',
    sectionId: '7.4',
    sectionName: '7.4 B树和B+树',
    title: '4阶B树构造个数（DS-WD-7.4.3-XT-25）',
    content: '【2025统考真题8】给定7个不同的关键字，能够构造的不同4阶B树的个数最多是（）。\nA. 7\nB. 8\nC. 9\nD. 10',
    mistakeType: 'B树构造理解错误',
    importance: 5,
    correction: '正确答案：C\n解析：4阶B树（m=4），每个节点关键字数：根1-3个，非根2-3个。7个关键字的4阶B树可能的形态取决于根节点的关键字数量（1、2或3个）以及子树的分布。经过计算，最多可以构造9种不同的4阶B树。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'ds_7_19',
    chapterId: 'ch7',
    chapterName: '第七章 查找',
    sectionId: '7.4',
    sectionName: '7.4 B树和B+树',
    title: 'B树叶结点个数（DS-WD-7.4.3-XT-5）',
    content: '具有n个关键字的m阶B树，应有（）个叶结点。\nA. n+1\nB. n-1\nC. mn\nD. nm/2',
    mistakeType: 'B树结构理解错误',
    importance: 5,
    correction: '正确答案：A\n解析：B树中，关键字将树分成若干区间，每个区间对应一个叶结点。n个关键字将空间分成n+1个区间，所以有n+1个叶结点。这个性质与二叉排序树的外部节点数相同。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'ds_7_20',
    chapterId: 'ch7',
    chapterName: '第七章 查找',
    sectionId: '7.4',
    sectionName: '7.4 B树和B+树',
    title: 'B树最少关键字数计算（DS-WD-7.4.3-XT-7）',
    content: '含有n个非叶结点的m阶B树中至少包含（）个关键字。\nA. n(m+1)\nB. n\nC. n(⌈m/2⌉-1)\nD. (n-1)(⌈m/2⌉-1)+1',
    mistakeType: 'B树关键字数计算错误',
    importance: 5,
    correction: '正确答案：D\n解析：m阶B树非叶结点最少⌈m/2⌉-1个关键字。根节点最少1个关键字，其他非叶结点最少⌈m/2-1个。总共n个非叶结点，根节点1个，其他n-1个节点各⌈m/2⌉-1个。总关键字数=1+(n-1)(⌈m/2⌉-1)。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'ds_8_5',
    chapterId: 'ch8',
    chapterName: '第八章 排序',
    sectionId: '8.2',
    sectionName: '8.2 插入排序',
    title: '希尔排序比较次数(DS-WD-8.2.4-XT-11)',
    content: '对序列{E, A, S, Y, Q, U, E, S, T, I, O, N}按照字典顺序排序,采用增量d=6,3,1的希尔排序算法。则前两趟排序后,关键字的总比较次数为()。\nA. 15\nB. 17\nC. 16\nD. 18',
    mistakeType: '希尔排序比较次数计算错误',
    importance: 4,
    correction: '正确答案:B\n解析:第一趟d=6,分成6组,每组2个元素,需要比较6次。第二趟d=3,分成3组,每组4个元素,需要比较11次(具体计算略)。总共6+11=17次比较。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'ds_8_11',
    chapterId: 'ch8',
    chapterName: '第八章 排序',
    sectionId: '8.3',
    sectionName: '8.3 交换排序',
    title: '快速排序递归深度（DS-WD-8.3.3-XT-13）',
    content: '对n个关键字进行快速排序,最大递归深度为(),最小递归深度为()。\nA. 1, log₂n\nB. n, log₂n\nC. 1, n\nD. 1, nlog₂n',
    mistakeType: '递归深度概念混淆',
    importance: 5,
    correction: '正确答案:B\n解析:最大递归深度发生在最坏情况(已有序或逆序),每次只能划分出一个元素,递归深度为n。最小递归深度发生在最好情况(每次平分),递归深度为log₂n。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'ds_8_13',
    chapterId: 'ch8',
    chapterName: '第八章 排序',
    sectionId: '8.3',
    sectionName: '8.3 交换排序',
    title: '快速排序第二趟结果判断（2014统考真题11）',
    content: '【2014统考真题11】下列选项中,不可能是快速排序第2趟排序结果的是()。\nA. 2, 3, 5, 4, 6, 7, 9\nB. 2, 7, 5, 6, 4, 3, 9\nC. 3, 2, 5, 4, 7, 6, 9\nD. 4, 2, 3, 5, 7, 6, 9',
    mistakeType: '快速排序过程判断错误',
    importance: 5,
    correction: '正确答案:C\n解析:快速排序每趟确定一个基准元素的最终位置。第2趟后应该有2个元素在最终位置。C选项中没有任何元素在最终位置(2应该在第1位,3应该在第2位,都不在),所以不可能是第2趟结果。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'ds_8_14',
    chapterId: 'ch8',
    chapterName: '第八章 排序',
    sectionId: '8.4',
    sectionName: '8.4 选择排序',
    title: 'Top-K问题最佳算法（DS-WD-8.4.3-XT-3）',
    content: '若只想得到100000个元素组成的序列中第10个最小元素之前的部分排序的序列,用()方法最快。\nA. 冒泡排序\nB. 快速排序\nC. 归并排序\nD. 堆排序',
    mistakeType: 'Top-K问题算法选择错误',
    importance: 5,
    correction: '正确答案:D\n解析:求Top-K问题,堆排序最优。只需建堆后执行k次删除堆顶操作即可,时间复杂度O(n+klog n)。快速排序虽然平均快,但最坏情况O(n²),且需要完全排序。堆排序可以在部分排序场景下更高效。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'ds_8_16',
    chapterId: 'ch8',
    chapterName: '第八章 排序',
    sectionId: '8.4',
    sectionName: '8.4 选择排序',
    title: '堆排序输出后剩余堆（DS-WD-8.4.3-XT-11）',
    content: '对关键码序列{23, 17, 72, 60, 25, 8, 68, 71, 52}进行堆排序,输出两个最小关键码后的剩余堆是()。\nA. {23, 72, 60, 25, 68, 71, 52}\nB. {23, 25, 52, 60, 71, 72, 68}\nC. {71, 25, 23, 52, 60, 72, 68}\nD. {23, 25, 68, 52, 60, 72, 71}',
    mistakeType: '堆调整过程计算错误',
    importance: 5,
    correction: '正确答案:D\n解析:首先建大根堆,然后输出最小元素(实际是堆排序输出最大元素,这里题目表述有歧义,应该是指输出堆顶后重新调整)。输出两个元素后,剩余7个元素重新调整为大根堆。正确答案是{23, 25, 68, 52, 60, 72, 71}。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'ds_8_18',
    chapterId: 'ch8',
    chapterName: '第八章 排序',
    sectionId: '8.4',
    sectionName: '8.4 选择排序',
    title: '大根堆构造（2021统考真题11）',
    content: '【2021统考真题11】将关键字6,9,1,5,8,4,7依次插入初始为空的大根堆H,得到的H是()。\nA. 9,8,7,6,5,4,1\nB. 9,8,7,5,6,1,4\nC. 9,8,7,5,6,4,1\nD. 9,6,7,5,8,4,1',
    mistakeType: '堆构造过程计算错误',
    importance: 5,
    correction: '正确答案:B\n解析:依次插入并调整:插入6→{6};插入9→{9,6};插入1→{9,6,1};插入5→{9,6,1,5};插入8→{9,8,1,5,6};插入4→{9,8,1,5,6,4};插入7→{9,8,7,5,6,1,4}。注意每次插入后要向上调整维持大根堆性质。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'ds_8_19',
    chapterId: 'ch8',
    chapterName: '第八章 排序',
    sectionId: '8.5',
    sectionName: '8.5 归并排序和基数排序',
    title: '排序算法空间复杂度（DS-WD-8.5.4-XT-3）',
    content: '在下列排序算法中,平均情况下空间复杂度为O(n)的是(),最坏情况下空间复杂度为O(n)的是()。\nI.希尔排序 II.堆排序 III.冒泡排序\nIV.归并排序 V.快速排序 VI.基数排序\nA. 归并排序,归并排序和快速排序\nB. 希尔排序,堆排序\nC. 归并排序,基数排序\nD. 冒泡排序,基数排序',
    mistakeType: '空间复杂度记忆错误',
    importance: 5,
    correction: '正确答案:A\n解析:归并排序需要O(n)辅助空间。快速排序平均O(log n)(递归栈),最坏O(n)(递归深度n)。希尔、堆、冒泡都是O(1)。基数排序需要O(n)空间。所以平均O(n)是归并,最坏O(n)是归并和快速排序。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'ds_8_26',
    chapterId: 'ch8',
    chapterName: '第八章 排序',
    sectionId: '8.6',
    sectionName: '8.6 各种排序算法的比较',
    title: '基本有序时比较次数最少的排序（DS-WD-8.6.3-XT-9）',
    content: '若序列的原始状态为{1, 2, 3, 4, 5, 10, 6, 7, 8, 9},要想使得排序过程中的元素比较次数最少,则应该采用()方法。\nA. 插入排序\nB. 选择排序\nC. 希尔排序\nD. 冒泡排序',
    mistakeType: '排序算法适用场景理解错误',
    importance: 4,
    correction: '正确答案:A\n解析:序列基本有序时,插入排序最优。因为插入排序在最好情况(已有序)下时间复杂度为O(n),只需要n-1次比较。选择排序无论什么情况都是O(n²)。冒泡排序虽然可以提前终止,但比较次数仍然多于插入排序。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'ds_8_29',
    chapterId: 'ch8',
    chapterName: '第八章 排序',
    sectionId: '8.6',
    sectionName: '8.6 各种排序算法的比较',
    title: '排序算法并行性（DS-WD-8.6.3-XT-12）',
    content: '如果一台计算机具有多核CPU,可以同时执行相互独立的任务。归并排序的各个归并段可以并行执行,下列排序方法中,不可以并行执行的有()。\nI. 基数排序 II. 快速排序 III. 冒泡排序 IV. 堆排序\nA. I、III\nB. I、II\nC. I、III、IV\nD. II、IV',
    mistakeType: '排序算法并行性理解错误',
    importance: 4,
    correction: '正确答案:A\n解析:基数排序必须按位依次进行(先个位、再十位...),不能并行。冒泡排序每趟依赖前一趟的结果,不能并行。快速排序的左右子序列可以并行处理。堆排序的调整过程也可以部分并行。所以I和III不能并行。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'ds_8_32',
    chapterId: 'ch8',
    chapterName: '第八章 排序',
    sectionId: '8.6',
    sectionName: '8.6 各种排序算法的比较',
    title: '选择插入排序而非快速排序的原因（2022统考真题11）',
    content: '【2022统考真题11】对数据进行排序时,若采用直接插入排序而不采用快速排序,则可能的原因是()\nI. 大部分元素已有序 II. 待排序元素数量很少\nIII. 要求空间复杂度为O(1) IV. 要求排序算法是稳定的\nA. 仅I、II\nB. 仅III、IV\nC. 仅I、II、IV\nD. I、II、III、IV',
    mistakeType: '排序算法选择依据理解不全面',
    importance: 5,
    correction: '正确答案:D\n解析:I正确,基本有序时插入排序O(n)优于快排O(nlog n)。II正确,数据量少时插入排序常数因子小,实际更快。III正确,插入排序O(1),快排平均O(log n)最坏O(n)。IV正确,插入排序稳定,快排不稳定。四个原因都成立。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'ds_8_33',
    chapterId: 'ch8',
    chapterName: '第八章 排序',
    sectionId: '8.6',
    sectionName: '8.6 各种排序算法的比较',
    title: '稳定排序与时间复杂度综合题（DS-WD-8.6.3-XT-4）',
    content: '下列排序算法中属于稳定排序的是(①),平均时间复杂度为O(nlog₂n)的是(②),在最好的情况下,时间复杂度可以达到线性时间的有(③)。\nI.冒泡排序 II.堆排序 III.选择排序\nIV.直接插入排序 V.希尔排序 VI.归并排序 VII.快速排序\nA. ①.冒泡排序、直接插入排序、归并排序 ②.堆排序、归并排序、快速排序 ③.冒泡排序、直接插入排序\nB. ①.直接插入排序、归并排序 .堆排序、快速排序 ③.冒泡排序、归并排序\nC. ①.冒泡排序、归并排序 .堆排序、归并排序、快速排序 ③.冒泡排序、希尔排序\nD. ①.冒泡排序、直接插入排序 ②.堆排序、归并排序、希尔排序 ③.冒泡排序、直接插入排序',
    mistakeType: '排序算法综合特性记忆混乱',
    importance: 5,
    correction: '正确答案:A\n解析:①稳定排序:冒泡、插入、归并(堆、选择、快排、希尔都不稳定)。②O(nlog n):堆、归并、快排(希尔平均也是但最坏O(n²))。③最好情况线性时间:冒泡(O(n)检测有序)、插入(O(n)基本有序)。归并最好也是O(nlog n)不能达到O(n)。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'ds_2_9',
    chapterId: 'ch2',
    chapterName: '第二章 线性表',
    sectionId: '2.2',
    sectionName: '2.2 链式存储',
    title: '链式存储结点地址（DS-2.2.2-XT-1）',
    content: '链式存储设计时，结点内的存储单元地址（）。\nA. 一定连续\nB. 一定不连续\nC. 不一定连续\nD. 部分连续，部分不连续',
    mistakeType: '粗心/审题不清',
    importance: 4,
    correction: '正确答案：A\n解析：结点"内"的存储单元地址一定连续（一个结点是一块连续内存），但结点"之间"的地址不一定连续。题目问的是结点内，不是结点间。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'ds_2_10',
    chapterId: 'ch2',
    chapterName: '第二章 线性表',
    sectionId: '2.2',
    sectionName: '2.2 链式存储',
    title: '线性表说法综合判断（DS-2.2.2-XT-2）',
    content: '下列关于线性表说法中，正确的是（）。\nI. 顺序存储方式只能用于存储线性结构\nII. 在一个设有头指针和尾指针的单链表中，删除表尾元素的时间复杂度与表长无关\nIII. 带头结点的单循环链表中不存在空指针\nIV. 在一个长度为n的有序单链表中插入一个新结点并仍保持有序的时间复杂度为O(n)\nV. 若用单链表来表示队列，则应该选用带尾指针的循环链表\nA. I、II\nB. I、III、IV、V\nC. IV、V\nD. III、IV、V',
    mistakeType: '概念不清',
    importance: 5,
    correction: '正确答案：D\n解析：I错：顺序存储也可用于非线性结构（如完全二叉树）；II错：单链表删表尾需找前驱，O(n)；III对：循环链表尾结点next指向头结点，无空指针；IV对：找位置O(n)+插入O(1)=O(n)；V对：带尾指针的循环链表入队出队都O(1)。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'ds_2_11',
    chapterId: 'ch2',
    chapterName: '第二章 线性表',
    sectionId: '2.2',
    sectionName: '2.2 链式存储',
    title: '有序单链表建立时间复杂度（DS-2.2.2-XT-3）',
    content: '给定有n个元素的一维数组，建立一个有序单链表的最低时间复杂度是（）。\nA. O(1)\nB. O(n)\nC. O(n²)\nD. O(nlog₂n)',
    mistakeType: '思路错误',
    importance: 5,
    correction: '正确答案：D\n解析：先对数组排序O(nlog n)，再依次插入链表尾部O(n)，总复杂度O(nlog n)。若逐个插入有序链表，每次找位置O(n)，共n次，总O(n²)。所以最低是O(nlog n)。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'ds_2_12',
    chapterId: 'ch2',
    chapterName: '第二章 线性表',
    sectionId: '2.2',
    sectionName: '2.2 链式存储',
    title: '循环单链表空表条件（DS-2.2.2-XT-4）',
    content: '对于一个带头结点的循环单链表L，判断该表为空表的条件是（）。\nA. 头结点的指针域为空\nB. L的值为NULL\nC. 头结点的指针域与L的值相等\nD. 头结点的指针域与L的地址相等',
    mistakeType: '概念不清',
    importance: 4,
    correction: '正确答案：C\n解析：L是头指针，指向头结点。空表时头结点的next指向自己（即L的值），所以头结点指针域==L。A错：循环链表无空指针；B错：L是头指针，非空；D错：是指针域的值（指向的地址）与L相等，不是指针域自身的地址。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'ds_2_18',
    chapterId: 'ch2',
    chapterName: '第二章 线性表',
    sectionId: '2.2',
    sectionName: '2.2 链式存储',
    title: '两个循环单链表头尾相接（DS-2.2.2-XT-6）',
    content: '设有两个长度为n的循环单链表，若要求两个循环单链表的头尾相接的时间复杂度为O(1)，则对应两个循环单链表各设置一个指针，分别指向（）。\nA. 各自的头结点\nB. 各自的尾结点\nC. 各自的首结点\nD. 一个表的头结点，另一个表的尾结点',
    mistakeType: '思路错误',
    importance: 5,
    correction: '正确答案：B\n解析：循环单链表尾结点的next指向头结点。若两指针都指向尾结点，则：表1尾->next=表1头，表2尾->next=表2头。拼接时：表1尾->next=表2头（即表2尾->next），表2尾->next=表1头，O(1)完成。若指向头结点，找尾需O(n)。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'ds_2_19',
    chapterId: 'ch2',
    chapterName: '第二章 线性表',
    sectionId: '2.2',
    sectionName: '2.2 链式存储',
    title: '循环单链表删除首元素（2021统考真题1）',
    content: '【2021统考真题1】已知头指针h指向一个带头结点的非空单循环链表，结点结构为 data|next，其中next是指向直接后继结点的指针，p是尾指针，q是临时指针。现要删除该链表的第一个元素，正确的语句序列是（）。\nA. h->next=h->next->next; q=h->next; free(q);\nB. q=h->next; h->next=h->next->next; free(q);\nC. q=h->next; h->next=q->next; if(p!=q) p=h; free(q);\nD. q=h->next; h->next=q->next; if(p==q) p=h; free(q);',
    mistakeType: '概念不清',
    importance: 5,
    correction: '正确答案：D\n解析：先q=h->next保存首元素，再h->next=q->next跳过首元素。关键：若链表只有一个元素（p==q），删除后链表为空，需让p=h指向头结点。C错在if(p!=q)条件反了，应该是p==q时才更新p。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  }
])
const activeTab = ref('list')
const showAddDialog = ref(false)
const selectedProblem = ref<WrongProblem | null>(null)

// 图片录入相关状态
const imageUploadMode = ref(false) // 是否启用图片录入模式
const uploadedImages = ref<string[]>([]) // 上传的图片列表（base64）
const imagePreviewUrl = ref('') // 当前预览的图片URL
const ocrTipVisible = ref(true) // 是否显示OCR提示

// 错题展开状态管理（记录每道题的订正笔记是否展开）
const expandedCorrections = ref<Set<string>>(new Set())

const newProblem = ref({
  chapterId: '',
  chapterName: '',
  sectionId: '',
  sectionName: '',
  title: '',
  content: '',
  mistakeType: '',
  importance: 3,
  correction: ''
})

const mistakeTypes = [
  { value: '概念不清', label: '概念理解不清' },
  { value: '计算错误', label: '计算错误' },
  { value: '思路错误', label: '解题思路错误' },
  { value: '粗心大意', label: '粗心/审题不清' },
  { value: '不会做', label: '完全不会做' }
]

const chapterFilter = ref('all')
const typeFilter = ref('all')
const masteredFilter = ref('all')

// 计算属性
const filteredProblems = computed(() => {
  return problems.value.filter(p => {
    if (chapterFilter.value !== 'all' && p.chapterId !== chapterFilter.value) return false
    if (typeFilter.value !== 'all' && p.mistakeType !== typeFilter.value) return false
    if (masteredFilter.value === 'mastered' && !p.mastered) return false
    if (masteredFilter.value === 'unmastered' && p.mastered) return false
    return true
  })
})

const chapters = computed(() => {
  const unique = new Map()
  problems.value.forEach(p => {
    if (!unique.has(p.chapterId)) {
      unique.set(p.chapterId, { id: p.chapterId, name: p.chapterName })
    }
  })
  return Array.from(unique.values())
})

const stats = computed(() => {
  const total = problems.value.length
  const mastered = problems.value.filter(p => p.mastered).length
  const unmastered = total - mastered
  
  const typeStats: Record<string, number> = {}
  problems.value.forEach(p => {
    typeStats[p.mistakeType] = (typeStats[p.mistakeType] || 0) + 1
  })
  
  return { total, mastered, unmastered, typeStats }
})

// 方法
const openAddDialog = () => {
  newProblem.value = {
    chapterId: '',
    chapterName: '',
    sectionId: '',
    sectionName: '',
    title: '',
    content: '',
    mistakeType: '',
    importance: 3,
    correction: ''
  }
  showAddDialog.value = true
}

const addProblem = () => {
  if (!newProblem.value.title || !newProblem.value.mistakeType) {
    ElMessage.warning('请填写题目和错误类型')
    return
  }
  
  const problem: WrongProblem = {
    id: `wrong_${Date.now()}`,
    chapterId: newProblem.value.chapterId || 'unknown',
    chapterName: newProblem.value.chapterName || '未分类',
    sectionId: newProblem.value.sectionId || '',
    sectionName: newProblem.value.sectionName || '',
    title: newProblem.value.title,
    content: newProblem.value.content,
    mistakeType: newProblem.value.mistakeType,
    importance: newProblem.value.importance,
    correction: newProblem.value.correction,
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  }
  
  problems.value.unshift(problem)
  saveToLocalStorage()
  showAddDialog.value = false
  ElMessage.success('错题添加成功')
}

const toggleMastered = (problem: WrongProblem) => {
  problem.mastered = !problem.mastered
  if (problem.mastered) {
    problem.reviewCount++
    problem.lastReviewAt = new Date().toISOString()
  }
  saveToLocalStorage()
  ElMessage.success(problem.mastered ? '已标记为掌握' : '已取消掌握')
}

const deleteProblem = (id: string) => {
  problems.value = problems.value.filter(p => p.id !== id)
  saveToLocalStorage()
  ElMessage.success('已删除')
}

const saveToLocalStorage = () => {
  localStorage.setItem('dsWrongProblems', JSON.stringify(problems.value))
}

const loadFromLocalStorage = () => {
  const saved = localStorage.getItem('dsWrongProblems')
  if (saved) {
    problems.value = JSON.parse(saved)
  }
}

// ==================== 图片录入相关函数 ====================

// 处理图片上传
const handleImageUpload = (file: File) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    const base64 = e.target?.result as string
    uploadedImages.value.push(base64)
    imagePreviewUrl.value = base64
    ElMessage.success('图片上传成功！请手动提取题目内容并填写到下方表单')
  }
  reader.readAsDataURL(file)
  return false // 阻止自动上传
}

// 删除已上传的图片
const removeImage = (index: number) => {
  uploadedImages.value.splice(index, 1)
  if (uploadedImages.value.length === 0) {
    imagePreviewUrl.value = ''
  } else {
    imagePreviewUrl.value = uploadedImages.value[uploadedImages.value.length - 1]
  }
}

// 切换图片预览模式
const toggleImageMode = () => {
  imageUploadMode.value = !imageUploadMode.value
  if (!imageUploadMode.value) {
    uploadedImages.value = []
    imagePreviewUrl.value = ''
  }
}

// 复制OCR提示文本（方便用户粘贴）
const copyOcrTemplate = () => {
  const template = `【题目标题】
【题目内容】
A. 
B. 
C. 
D. 
【正确答案】
【错误原因/解析】`
  navigator.clipboard.writeText(template).then(() => {
    ElMessage.success('模板已复制到剪贴板，请根据图片内容填写')
  })
}

// 快速填充示例（用于测试）
const fillExampleData = () => {
  newProblem.value = {
    chapterId: 'ch2',
    chapterName: '第二章 线性表',
    sectionId: '2.1',
    sectionName: '2.1 线性表的定义和基本操作',
    title: '顺序表的基本操作',
    content: '在长度为n的顺序表中，插入一个元素的时间复杂度是（）。\nA. O(1)\nB. O(n)\nC. O(logn)\nD. O(n²)',
    mistakeType: '计算错误',
    importance: 4,
    correction: '正确答案：B\n解析：顺序表插入需要移动元素，平均移动n/2个元素，时间复杂度为O(n)。'
  }
  ElMessage.success('已填充示例数据，您可以根据实际图片内容修改')
}

// ==================== 错题展开/折叠功能 ====================

// 切换订正笔记的展开/折叠状态
const toggleCorrection = (problemId: string) => {
  if (expandedCorrections.value.has(problemId)) {
    expandedCorrections.value.delete(problemId)
  } else {
    expandedCorrections.value.add(problemId)
  }
}

// 检查某道题的订正笔记是否展开
const isCorrectionExpanded = (problemId: string) => {
  return expandedCorrections.value.has(problemId)
}

const getMistakeTypeTag = (type: string) => {
  const map: Record<string, string> = {
    '概念不清': 'danger',
    '计算错误': 'warning',
    '思路错误': 'info',
    '粗心大意': 'success',
    '不会做': 'danger'
  }
  return map[type] || 'default'
}

const getImportanceStars = (level: number) => {
  return '⭐'.repeat(level)
}

// 格式化题目内容，按行分割
const formatContent = (content: string): string[] => {
  if (!content) return []
  // 按换行符分割，过滤空行
  return content.split('\n').filter(line => line.trim() !== '')
}

onMounted(() => {
  loadFromLocalStorage()
})

// 暴露方法供外部调用
defineExpose({
  openAddDialog,
  problems
})
</script>

<template>
  <div class="wrong-problems-container">
    <!-- 顶部统计 -->
    <div class="stats-bar">
      <div class="stat-item">
        <div class="stat-value">{{ stats.total }}</div>
        <div class="stat-label">总错题数</div>
      </div>
      <div class="stat-item mastered">
        <div class="stat-value">{{ stats.mastered }}</div>
        <div class="stat-label">已掌握</div>
      </div>
      <div class="stat-item unmastered">
        <div class="stat-value">{{ stats.unmastered }}</div>
        <div class="stat-label">未掌握</div>
      </div>
    </div>

    <!-- 功能标签页 -->
    <el-tabs v-model="activeTab" class="wrong-tabs">
      <el-tab-pane label="错题列表" name="list">
        <!-- 筛选栏 -->
        <div class="filter-bar">
          <el-button type="primary" @click="openAddDialog">
            <el-icon><Plus /></el-icon>
            添加错题
          </el-button>
          
          <el-space>
            <el-select v-model="chapterFilter" placeholder="按章节筛选" clearable style="width: 150px">
              <el-option label="全部章节" value="all" />
              <el-option 
                v-for="ch in chapters" 
                :key="ch.id" 
                :label="ch.name" 
                :value="ch.id" 
              />
            </el-select>
            
            <el-select v-model="typeFilter" placeholder="按类型筛选" clearable style="width: 150px">
              <el-option label="全部类型" value="all" />
              <el-option 
                v-for="type in mistakeTypes" 
                :key="type.value" 
                :label="type.label" 
                :value="type.value" 
              />
            </el-select>
            
            <el-select v-model="masteredFilter" placeholder="掌握状态" clearable style="width: 130px">
              <el-option label="全部" value="all" />
              <el-option label="已掌握" value="mastered" />
              <el-option label="未掌握" value="unmastered" />
            </el-select>
          </el-space>
        </div>

        <!-- 错题列表 -->
        <div class="problems-list">
          <el-card 
            v-for="problem in filteredProblems" 
            :key="problem.id"
            class="problem-card"
            :class="{ mastered: problem.mastered }"
          >
            <div class="problem-header">
              <div class="problem-title">
                <h4>{{ problem.title }}</h4>
                <div class="problem-tags">
                  <el-tag :type="getMistakeTypeTag(problem.mistakeType)" size="small">
                    {{ problem.mistakeType }}
                  </el-tag>
                  <span class="importance">{{ getImportanceStars(problem.importance) }}</span>
                </div>
              </div>
              <div class="problem-actions">
                <el-button 
                  :type="problem.mastered ? 'success' : 'default'"
                  size="small"
                  @click="toggleMastered(problem)"
                >
                  {{ problem.mastered ? '已掌握 ✓' : '标记掌握' }}
                </el-button>
                <el-button 
                  type="danger" 
                  size="small"
                  @click="deleteProblem(problem.id)"
                >
                  删除
                </el-button>
              </div>
            </div>
            
            <div class="problem-meta">
              <span>📚 {{ problem.chapterName }}</span>
              <span v-if="problem.sectionName">| {{ problem.sectionName }}</span>
              <span>| 📅 {{ new Date(problem.createdAt).toLocaleDateString() }}</span>
              <span v-if="problem.reviewCount > 0">| 复习 {{ problem.reviewCount }} 次</span>
            </div>
            
            <div v-if="problem.content" class="problem-content">
              <strong>题目内容：</strong>
              <div class="content-text">
                <div v-for="(line, index) in formatContent(problem.content)" :key="index" class="content-line">
                  {{ line }}
                </div>
              </div>
            </div>
            
            <div v-if="problem.correction" class="problem-correction">
              <div class="correction-header" @click="toggleCorrection(problem.id)">
                <strong>订正笔记</strong>
                <el-icon 
                  class="expand-icon" 
                  :class="{ expanded: isCorrectionExpanded(problem.id) }"
                >
                  <ArrowDown />
                </el-icon>
              </div>
              <transition name="expand">
                <div v-show="isCorrectionExpanded(problem.id)" class="correction-text">
                  {{ problem.correction }}
                </div>
              </transition>
            </div>
          </el-card>
          
          <div v-if="filteredProblems.length === 0" class="empty-state">
            <el-icon size="80" color="#c0c4cc"><DocumentChecked /></el-icon>
            <p>暂无错题记录</p>
            <el-button type="primary" @click="openAddDialog">添加第一道错题</el-button>
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane label="统计分析" name="stats">
        <div class="stats-content">
          <el-card>
            <template #header>
              <h3>错误类型分布</h3>
            </template>
            <div class="type-stats">
              <div 
                v-for="(count, type) in stats.typeStats" 
                :key="type"
                class="type-stat-item"
              >
                <div class="type-label">
                  <el-tag :type="getMistakeTypeTag(type)">{{ type }}</el-tag>
                </div>
                <el-progress 
                  :percentage="Math.round((count / stats.total) * 100)" 
                  :stroke-width="20"
                />
                <div class="type-count">{{ count }} 题</div>
              </div>
            </div>
          </el-card>
        </div>
      </el-tab-pane>
    </el-tabs>

    <!-- 添加错题对话框 -->
    <el-dialog 
      v-model="showAddDialog" 
      title="添加错题"
      width="800px"
      :close-on-click-modal="false"
    >
      <!-- 图片录入模式切换按钮 -->
      <div style="margin-bottom: 16px; display: flex; gap: 12px; align-items: center;">
        <el-button 
          :type="imageUploadMode ? 'primary' : 'default'" 
          @click="toggleImageMode"
          :icon="Picture"
        >
          {{ imageUploadMode ? '关闭图片预览' : '启用图片录入模式' }}
        </el-button>
        <el-button 
          v-if="imageUploadMode" 
          @click="copyOcrTemplate"
          :icon="CopyDocument"
          size="small"
        >
          复制填写模板
        </el-button>
        <el-button 
          v-if="imageUploadMode && uploadedImages.length === 0" 
          @click="fillExampleData"
          :icon="MagicStick"
          size="small"
        >
          填充示例数据
        </el-button>
      </div>

      <!-- 图片上传和预览区域 -->
      <div v-if="imageUploadMode" style="margin-bottom: 20px; padding: 16px; background: #f5f7fa; border-radius: 8px;">
        <el-alert
          v-if="ocrTipVisible"
          title="💡 使用提示"
          type="info"
          :closable="true"
          @close="ocrTipVisible = false"
          style="margin-bottom: 12px"
        >
          <p style="margin: 4px 0;">1. 点击下方上传按钮或拖拽图片到此处</p>
          <p style="margin: 4px 0;">2. 查看右侧图片，手动提取题目内容</p>
          <p style="margin: 4px 0;">3. 将提取的内容填写到下方表单中</p>
          <p style="margin: 4px 0; color: #e6a23c;">⚠️ 目前需要手动录入，未来可集成OCR自动识别</p>
        </el-alert>

        <el-upload
          class="image-uploader"
          action="#"
          :auto-upload="false"
          :on-change="(file: any) => handleImageUpload(file.raw)"
          :show-file-list="false"
          accept="image/*"
          drag
          multiple
        >
          <el-icon class="el-icon--upload"><Upload /></el-icon>
          <div class="el-upload__text">
            拖拽图片到此处或 <em>点击上传</em>
          </div>
          <template #tip>
            <div class="el-upload__tip">支持 JPG/PNG 格式，可同时上传多张图片</div>
          </template>
        </el-upload>

        <!-- 图片预览区 -->
        <div v-if="uploadedImages.length > 0" style="margin-top: 16px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span style="font-weight: bold; color: #606266;">已上传 {{ uploadedImages.length }} 张图片</span>
            <el-button size="small" @click="uploadedImages = []; imagePreviewUrl = ''">清空全部</el-button>
          </div>
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 12px;">
            <div 
              v-for="(img, index) in uploadedImages" 
              :key="index"
              style="position: relative; border: 2px solid #dcdfe6; border-radius: 8px; overflow: hidden; cursor: pointer;"
              :style="{ borderColor: imagePreviewUrl === img ? '#409eff' : '#dcdfe6' }"
              @click="imagePreviewUrl = img"
            >
              <img :src="img" style="width: 100%; height: 150px; object-fit: cover;" />
              <div 
                style="position: absolute; top: 4px; right: 4px; background: rgba(0,0,0,0.6); color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; cursor: pointer;"
                @click.stop="removeImage(index)"
              >
                ×
              </div>
              <div style="position: absolute; bottom: 0; left: 0; right: 0; background: rgba(0,0,0,0.5); color: white; text-align: center; font-size: 12px; padding: 2px;">
                {{ index + 1 }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style="display: flex; gap: 20px;">
        <!-- 左侧：图片预览（大图） -->
        <div v-if="imageUploadMode && imagePreviewUrl" style="flex: 1; max-width: 400px;">
          <div style="border: 2px solid #409eff; border-radius: 8px; overflow: hidden; background: #fff;">
            <img :src="imagePreviewUrl" style="width: 100%; max-height: 600px; object-fit: contain;" />
          </div>
          <p style="text-align: center; color: #909399; font-size: 12px; margin-top: 8px;">
            👆 点击图片放大查看细节
          </p>
        </div>

        <!-- 右侧：表单填写区 -->
        <el-form :model="newProblem" label-position="top" :style="{ flex: imageUploadMode ? 1 : 1 }">
        <el-form-item label="所属章节">
          <el-input v-model="newProblem.chapterName" placeholder="例如：第一章 计算机系统概述" />
        </el-form-item>
        
        <el-form-item label="所属小节">
          <el-input v-model="newProblem.sectionName" placeholder="例如：1.1 计算机发展历程（可选）" />
        </el-form-item>
        
        <el-form-item label="题目标题">
          <el-input v-model="newProblem.title" placeholder="简要描述题目" />
        </el-form-item>
        
        <el-form-item label="题目内容">
          <el-input 
            v-model="newProblem.content" 
            type="textarea" 
            :rows="4"
            placeholder="详细的题目内容..."
          />
        </el-form-item>
        
        <el-form-item label="错误类型">
          <el-select v-model="newProblem.mistakeType" placeholder="选择错误类型" style="width: 100%">
            <el-option 
              v-for="type in mistakeTypes" 
              :key="type.value" 
              :label="type.label" 
              :value="type.value" 
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="重要程度">
          <el-rate v-model="newProblem.importance" :max="5" />
        </el-form-item>
        
        <el-form-item label="订正笔记">
          <el-input 
            v-model="newProblem.correction" 
            type="textarea" 
            :rows="4"
            placeholder="正确的解题思路和答案（可选）"
          />
        </el-form-item>
      </el-form>
      </div>
      
      <template #footer>
        <el-button @click="showAddDialog = false">取消</el-button>
        <el-button type="primary" @click="addProblem">添加</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.wrong-problems-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #fff;
  
  .stats-bar {
    display: flex;
    gap: 20px;
    padding: 16px;
    background: linear-gradient(135deg, #16345c 0%, #1e4576 100%);
    border-radius: 12px;
    margin-bottom: 16px;
    
    .stat-item {
      flex: 1;
      text-align: center;
      color: white;
      
      &.mastered {
        background: rgba(255, 255, 255, 0.2);
        border-radius: 8px;
        padding: 8px;
      }
      
      &.unmastered {
        background: rgba(255, 255, 255, 0.15);
        border-radius: 8px;
        padding: 8px;
      }
      
      .stat-value {
        font-size: 2em;
        font-weight: 700;
        margin-bottom: 4px;
      }
      
      .stat-label {
        font-size: 0.9em;
        opacity: 0.9;
      }
    }
  }
  
  .wrong-tabs {
    flex: 1;
    display: flex;
    flex-direction: column;
    
    :deep(.el-tabs__content) {
      flex: 1;
      overflow-y: auto;
      padding: 16px 0;
    }
  }
  
  .filter-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    padding: 12px;
    background: #f5f7fa;
    border-radius: 8px;
  }
  
  .problems-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    
    .problem-card {
      transition: all 0.3s;
      border-left: 4px solid #ffc53d;
      
      &.mastered {
        border-left-color: #67c23a;
        opacity: 0.7;
        
        .problem-title h4 {
          text-decoration: line-through;
          color: #909399;
        }
      }
      
      &:hover {
        transform: translateX(4px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }
      
      .problem-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 12px;
        
        .problem-title {
          flex: 1;
          
          h4 {
            margin: 0 0 8px 0;
            color: #303133;
            font-size: 1.1em;
          }
          
          .problem-tags {
            display: flex;
            gap: 8px;
            align-items: center;
            
            .importance {
              font-size: 0.9em;
            }
          }
        }
        
        .problem-actions {
          display: flex;
          gap: 8px;
        }
      }
      
      .problem-meta {
        font-size: 0.85em;
        color: #909399;
        margin-bottom: 12px;
        padding-bottom: 12px;
        border-bottom: 1px solid #ebeef5;
        
        span {
          margin-right: 8px;
        }
      }
      
      .problem-content,
      .problem-correction {
        margin-bottom: 12px;
        
        strong {
          display: block;
          margin-bottom: 8px;
          color: #606266;
          font-size: 0.95em;
        }
        
        // 订正笔记头部（可点击）
        .correction-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 12px;
          background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s;
          user-select: none;
          
          &:hover {
            background: linear-gradient(135deg, #ffe0b2 0%, #ffcc80 100%);
            box-shadow: 0 2px 8px rgba(255, 152, 0, 0.2);
          }
          
          strong {
            margin: 0;
            color: #e65100;
            font-weight: 600;
          }
          
          .expand-icon {
            transition: transform 0.3s;
            color: #ff9800;
            font-size: 18px;
            
            &.expanded {
              transform: rotate(180deg);
            }
          }
        }
        
        .content-text,
        .correction-text {
          padding: 16px;
          background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%);
          border-radius: 8px;
          line-height: 1.8;
          color: #303133;
          font-size: 0.95em;
        }
        
        .content-text {
          .content-line {
            padding: 6px 0;
            min-height: 24px;
            
            // 题目前缀（非选项行）
            &:first-child:not(:only-child) {
              font-weight: 600;
              color: #303133;
              padding-bottom: 10px;
              border-bottom: 1px dashed #dcdfe6;
              margin-bottom: 8px;
            }
            
            // 选项行样式
            &:not(:first-child) {
              padding-left: 16px;
              position: relative;
              transition: all 0.2s;
              
              &:hover {
                background: rgba(13, 33, 55, 0.08);
                border-radius: 4px;
                padding-left: 20px;
              }
              
              // 选项标识符（A. B. C. D.）加粗
              &::before {
                content: '';
                position: absolute;
                left: 0;
                top: 50%;
                transform: translateY(-50%);
                width: 4px;
                height: 4px;
                background: #16345c;
                border-radius: 50%;
              }
            }
          }
        }
        
        .correction-text {
          white-space: pre-wrap;
          background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
          border-left: 3px solid #ff9800;
          margin-top: 8px;
        }
      }
    }
    
    // 展开/折叠动画
    .expand-enter-active,
    .expand-leave-active {
      transition: all 0.3s ease;
      overflow: hidden;
    }
    
    .expand-enter-from,
    .expand-leave-to {
      opacity: 0;
      max-height: 0;
      padding: 0 16px;
    }
    
    .expand-enter-to,
    .expand-leave-from {
      opacity: 1;
      max-height: 500px;
      padding: 16px;
    }
    
    .empty-state {
      text-align: center;
      padding: 60px 20px;
      color: #909399;
      
      p {
        margin: 16px 0;
        font-size: 1.1em;
      }
    }
  }
  
  .stats-content {
    .type-stats {
      display: flex;
      flex-direction: column;
      gap: 16px;
      
      .type-stat-item {
        display: flex;
        align-items: center;
        gap: 12px;
        
        .type-label {
          min-width: 100px;
        }
        
        :deep(.el-progress) {
          flex: 1;
        }
        
        .type-count {
          min-width: 60px;
          text-align: right;
          font-weight: 600;
          color: #606266;
        }
      }
    }
  }
}
</style>
