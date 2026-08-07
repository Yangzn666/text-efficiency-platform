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
    id: 'ds_6_16',
    chapterId: 'ch6',
    chapterName: '第六章 图',
    sectionId: '6.3',
    sectionName: '6.3 图的遍历',
    title: 'DFS遍历序列（DS-WD-6.3.4-XT-7）',
    content: '无向图G=(V,E)，其中V={a,b,c,d,e,f}，E={(a,b),(a,e),(a,c),(b,e),(c,f),(f,d),(e,d)}，对该图从a开始进行深度优先遍历，得到的顶点序列正确的是（）。\nA. a,b,e,c,d,f\nB. a,c,f,e,b,d\nC. a,e,b,c,f,d\nD. a,e,d,f,c,b',
    mistakeType: 'DFS遍历过程理解错误',
    importance: 4,
    correction: '正确答案：D\n解析：从a出发：a→e（a的邻接点）→d（e的邻接点）→f（d的邻接点）→c（f的邻接点）→b（回溯到c，b是c的邻接点）。注意：DFS是“一条路走到黑”，访问顺序取决于邻接点的存储顺序。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'ds_6_17',
    chapterId: 'ch6',
    chapterName: '第六章 图',
    sectionId: '6.3',
    sectionName: '6.3 图的遍历',
    title: 'DFS序列个数（DS-WD-6.3.4-XT-8）',
    content: '如下图所示，在下面的5个序列中，符合深度优先遍历的序列个数是（）。\n1.aebfdc 2.acfdeb 3.aedfcb 4.aefdbc 5.aecfdb\nA. 5\nB. 4\nC. 3\nD. 2',
    mistakeType: 'DFS序列判断错误',
    importance: 4,
    correction: '正确答案：D\n解析：从a出发，邻接点有b,e,c。DFS序列必须以a开头，然后是b、e、c中的一个，再深入。只有3.aedfcb和5.aecfdb符合DFS规则。1.aebfdc错误：访问e后应继续深入，不应跳到f。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'ds_6_18',
    chapterId: 'ch6',
    chapterName: '第六章 图',
    sectionId: '6.3',
    sectionName: '6.3 图的遍历',
    title: 'DFS和BFS与树遍历的类比（DS-WD-6.3.4-XT-9）',
    content: '用邻接表存储的图的深度优先遍历算法类似于树的（），而其广度优先遍历算法类似于树的（）。\nA. ①中序遍历 ②后序遍历\nB. ①先序遍历 ②按层次遍历\nC. ①后序遍历 ②按层次遍历\nD. ①按层次遍历 ②后序遍历',
    mistakeType: '算法类比理解错误',
    importance: 4,
    correction: '正确答案：B\n解析：DFS类似于树的先序遍历（根→左→右，先访问再深入）；BFS类似于树的层次遍历（逐层访问）。注意：图的遍历需要考虑访问标记，防止重复访问。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'ds_6_19',
    chapterId: 'ch6',
    chapterName: '第六章 图',
    sectionId: '6.3',
    sectionName: '6.3 图的遍历',
    title: '生成树与连通分量的区别（DS-WD-6.3.4-XT-13）',
    content: '设无向图G=(V,E)和G\'=(V\',E\')，若G\'是G的生成树，则下列说法错误的是（）。\nA. G\'为G的子图\nB. G\'为G的连通分量\nC. G\'为G的极小连通子图且V=V\'\nD. G\'是G的一个无环子图',
    mistakeType: '概念混淆',
    importance: 5,
    correction: '正确答案：B\n解析：生成树=极小连通子图（n个顶点，n-1条边）；连通分量=极大连通子图。两者定义相反！生成树是“极小”（边最少），连通分量是“极大”（包含所有可达顶点）。A、C、D都正确描述了生成树的性质。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'ds_6_20',
    chapterId: 'ch6',
    chapterName: '第六章 图',
    sectionId: '6.4',
    sectionName: '6.4 图的应用',
    title: 'Prim和Kruskal算法生成树是否相同（DS-WD-6.4.6-XT-2）',
    content: '用Prim算法和Kruskal算法构造图的最小生成树，所得到的最小生成树（）。\nA. 相同\nB. 不相同\nC. 可能相同，可能不同\nD. 无法比较',
    mistakeType: '算法理解错误',
    importance: 5,
    correction: '正确答案：C\n解析：最小生成树可能不唯一（当有权值相同的边时）。Prim和Kruskal算法得到的MST可能相同（边权都不同），也可能不同（有权值相同的边，选择顺序不同）。但权值之和一定相同。',
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
    id: 'ds_6_22',
    chapterId: 'ch6',
    chapterName: '第六章 图',
    sectionId: '6.4',
    sectionName: '6.4 图的应用',
    title: '最小生成树的唯一性（DS-WD-6.4.6-XT-3）',
    content: '下列关于图的生成树和最小生成树的叙述中，正确的是（）。\nA. 只要无向连通图中没有权值相同的边，则其最小生成树唯一\nB. 只要无向图中有权值相同的边，则其最小生成树一定不唯一\nC. 从n个顶点的连通图中选取n-1条权值最小的边，即可构成最小生成树\nD. 设连通图G含有n个顶点，则含有n个顶点、n-1条边的子图一定是G的生成树',
    mistakeType: '概念理解错误',
    importance: 5,
    correction: '正确答案：A\n解析：A正确：边权都不同时MST唯一；B错误：有权值相同的边时MST“可能”不唯一，不是一定；C错误：选n-1条最小边可能形成环，不一定构成树；D错误：还必须连通，不连通的n个顶点n-1条边不是生成树。',
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
    id: 'ds_6_24',
    chapterId: 'ch6',
    chapterName: '第六章 图',
    sectionId: '6.4',
    sectionName: '6.4 图的应用',
    title: 'Dijkstra算法执行过程（DS-WD-6.4.6-XT-10）',
    content: '用Dijkstra算法求一个带权有向图的从顶点0出发的最短路径，在算法执行的某时刻，已求得的最短路径的顶点集合S={0,2,3,4}，下一个选取的目标顶点是顶点1，则可能修改的最短路径是（）。\nA. 从顶点0到顶点3的最短路径\nB. 从顶点0到顶点2的最短路径\nC. 从顶点2到顶点4的最短路径\nD. 从顶点0到顶点1的最短路径',
    mistakeType: '算法执行过程理解错误',
    importance: 5,
    correction: '正确答案：D\n解析：Dijkstra算法：当顶点1加入S时，会以1为中转更新其他顶点的最短路径。但注意：S中的顶点（0,2,3,4）的最短路径已经确定，不会再被修改。只有不在S中的顶点（如1,5,6...）的最短路径可能被修改。所以是从0到1的最短路径（1刚加入S，其最短路径刚确定）。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'ds_6_25',
    chapterId: 'ch6',
    chapterName: '第六章 图',
    sectionId: '6.4',
    sectionName: '6.4 图的应用',
    title: '拓扑排序的性质（DS-WD-6.4.6-XT-14）',
    content: '下列关于拓扑排序的说法中，正确的是（）。\nI. 顶点数大于1的强连通图不能进行拓扑排序\nII. 在一个有向图的拓扑序列中，若顶点a在顶点b之前，则图中必有一条弧<a,b>\nIII. 若有向无环图的拓扑序列唯一，则可以唯一确定该图\nA. I和II\nB. I、II和III\nC. 仅I\nD. I和III',
    mistakeType: '拓扑排序理解错误',
    importance: 5,
    correction: '正确答案：C\n解析：I正确：强连通图有环，不能拓扑排序；II错误：a在b前只说明a到b有路径（直接或间接），不一定有直接弧；III错误：拓扑序列唯一只能说明每对相邻顶点间有弧，不能确定整个图（可能有多条路径）。',
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
    id: 'ds_6_31',
    chapterId: 'ch6',
    chapterName: '第六章 图',
    sectionId: '6.4',
    sectionName: '6.4 图的应用',
    title: 'AOE网关键活动判断（DS-WD-6.4.6-XT-31）',
    content: '【2013统考真题9】下列AOE网表示一项包含8个活动的工程。通过同时加快若干活动的进度可以缩短整个工程的工期。下列选项中，加快其进度就可以缩短工程工期的是（）。\n（图中有6个顶点，8个活动：a=3（1→2），b=8（1→3），c=9（2→4），d=4（3→2），e=6（2→5），f=10（3→5），g=6（4→6），h=9（5→6））\nA. c和e\nB. d和c\nC. f和d\nD. f和h',
    mistakeType: '关键路径计算错误',
    importance: 5,
    correction: '正确答案：C\n解析：计算关键路径：\n路径1：a→c→g = 3+9+6 = 18\n路径2：a→e→h = 3+6+9 = 18\n路径3：b→d→c→g = 8+4+9+6 = 27\n路径4：b→d→e→h = 8+4+6+9 = 27\n路径5：b→f→h = 8+10+9 = 27（关键路径）\n关键路径是b→f→h和b→d→e→h（都是27）。缩短f和d可同时缩短两条关键路径，故选C。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'ds_6_32',
    chapterId: 'ch6',
    chapterName: '第六章 图',
    sectionId: '6.4',
    sectionName: '6.4 图的应用',
    title: 'Dijkstra算法目标顶点顺序（DS-WD-6.4.6-XT-35）',
    content: '【2016统考真题8】使用Dijkstra算法求下图中从顶点1到其他各顶点的最短路径，依次得到的各最短路径的目标顶点是（）。\n（图中有6个顶点，边：1→2为5，1→4为4，1→5为2，2→3为2，2→4为9，3→5为6，4→5为6，5→4为7，5→6为5，6→3为2）\nA. 5, 2, 3, 4, 6\nB. 5, 2, 3, 6, 4\nC. 5, 2, 4, 3, 6\nD. 5, 2, 6, 3, 4',
    mistakeType: 'Dijkstra算法执行过程理解错误',
    importance: 5,
    correction: '正确答案：B\n解析：Dijkstra执行：从1出发，dist[1]=0。\n第1步：选5（dist=2），S={1,5}；\n第2步：选2（dist=5，通过1→2），S={1,5,2}；\n第3步：选3（dist=7，通过1→2→3），S={1,5,2,3}；\n第4步：选6（dist=9，通过5→6），S={1,5,2,3,6}；\n第5步：选4（dist=11，通过1→4或5→4）。顺序：5,2,3,6,4。',
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
    id: 'ds_7_1',
    chapterId: 'ch7',
    chapterName: '第七章 查找',
    sectionId: '7.2',
    sectionName: '7.2 顺序查找和折半查找',
    title: '有序单链表顺序查找平均长度（DS-WD-7.2.4-XT-3）',
    content: '对长度为n的有序单链表，若查找每个元素的概率相等，则顺序查找表中任意一个元素的查找成功的平均查找长度为（）。\nA. n/2\nB. (n+1)/2\nC. (n-1)/2\nD. n/4',
    mistakeType: '平均查找长度计算错误',
    importance: 4,
    correction: '正确答案：B\n解析：有序单链表只能顺序查找，查找第i个元素需要比较i次。ASL = (1+2+...+n)/n = n(n+1)/(2n) = (n+1)/2。注意：即使是有序链表，也不能折半查找，因为链表不支持随机访问。',
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
    id: 'ds_7_3',
    chapterId: 'ch7',
    chapterName: '第七章 查找',
    sectionId: '7.2',
    sectionName: '7.2 顺序查找和折半查找',
    title: '二分查找比较序列（DS-WD-7.2.4-XT-11）',
    content: '若有序表的关键字序列为{b,c,d,e,f,g,q,r,s,t}，则在二分查找关键字b的过程中，进行比较的关键字依次为（）。\nA. f,c,b\nB. f,d,b\nC. g,c,b\nD. g,d,b',
    mistakeType: '折半查找过程理解错误',
    importance: 5,
    correction: '正确答案：A\n解析：有序表有10个元素，下标1-10。\n第1次：mid=(1+10)/2=5，比较f，b<f，在左半部分[1,4]；\n第2次：mid=(1+4)/2=2，比较c，b<c，在左半部分[1,1]；\n第3次：mid=(1+1)/2=1，比较b，找到。比较序列：f,c,b。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'ds_7_4',
    chapterId: 'ch7',
    chapterName: '第七章 查找',
    sectionId: '7.2',
    sectionName: '7.2 顺序查找和折半查找',
    title: '折半查找成功和失败的平均查找长度（DS-WD-7.2.4-XT-14）',
    content: '具有12个关键字的有序表中，对每个关键字的查找概率相同，折半查找算法查找成功的平均查找长度为（①），折半查找查找失败的平均查找长度为（②）。\nA. ①37/12 ②49/13\nB. ①35/12 ②39/13\nC. ①37/12 ②39/13\nD. ①35/12 ②49/13',
    mistakeType: '平均查找长度计算错误',
    importance: 5,
    correction: '正确答案：A\n解析：12个关键字的判定树：\n成功：第1层1个，第2层2个，第3层4个，第4层5个。ASL成功=(1×1+2×2+3×4+4×5)/12=37/12。\n失败：外部节点有13个，分布在第4层和第5层。ASL失败=(外部节点深度之和)/13=49/13。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'ds_7_5',
    chapterId: 'ch7',
    chapterName: '第七章 查找',
    sectionId: '7.2',
    sectionName: '7.2 顺序查找和折半查找',
    title: '折半查找的性质（DS-WD-7.2.4-XT-15）',
    content: '下列关于查找的说法中，正确的是（）。（注，涉及下节内容）\nA. 如果数据元素保持有序，则查找时就可以采用折半查找法\nB. 折半查找与二叉查找树的时间性能在最坏的情况下是相同的\nC. 折半查找法的平均查找长度一定小于顺序查找法\nD. 折半查找法查找一个元素大约需要O(log₂n)次关键字比较',
    mistakeType: '查找算法理解错误',
    importance: 5,
    correction: '正确答案：D\n解析：A错误：有序链表不能用折半查找（不支持随机访问）；B错误：BST最坏O(n)，折半查找最坏O(log n)；C错误：当n很小时顺序查找可能更优；D正确：折半查找基于二叉判定树，树高≈log₂n，所以比较次数≈O(log₂n)。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'ds_7_6',
    chapterId: 'ch7',
    chapterName: '第七章 查找',
    sectionId: '7.2',
    sectionName: '7.2 顺序查找和折半查找',
    title: '分块查找平均查找长度（DS-WD-7.2.4-XT-18）',
    content: '设顺序存储的某线性表共有123个元素，按分块查找的要求等分为3块。若对索引表采用顺序查找法来确定子块，且在确定的子块中也采用顺序查找法，则在等概率情况下，分块查找成功的平均查找长度为（）。\nA. 21\nB. 23\nC. 41\nD. 62',
    mistakeType: '分块查找ASL计算错误',
    importance: 4,
    correction: '正确答案：B\n解析：123个元素分3块，每块41个元素。\n索引表ASL = (1+2+3)/3 = 2；\n块内ASL = (1+2+...+41)/41 = 21；\n总ASL = 索引表ASL + 块内ASL = 2 + 21 = 23。',
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
    id: 'ds_7_8',
    chapterId: 'ch7',
    chapterName: '第七章 查找',
    sectionId: '7.3',
    sectionName: '7.3 二叉排序树和平衡二叉树',
    title: '二叉排序树最多比较次数（DS-WD-7.3.4-XT-8）',
    content: '在含有n个结点的二叉排序树中查找某个关键字的结点时，最多进行（）次比较。\nA. n/2\nB. log₂n\nC. log₂n + 1\nD. n',
    mistakeType: '最坏情况理解错误',
    importance: 4,
    correction: '正确答案：D\n解析：二叉排序树在最坏情况下（插入顺序有序）会退化为链表，树高为n，最多比较n次。注意：平衡二叉树最多比较O(log n)次，但普通二叉排序树没有这个保证。',
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
    id: 'ds_7_14',
    chapterId: 'ch7',
    chapterName: '第七章 查找',
    sectionId: '7.3',
    sectionName: '7.3 二叉排序树和平衡二叉树',
    title: '平衡二叉树平衡因子计算（DS-WD-7.3.4-XT-28）',
    content: '【2013统考真题3】若将关键字1,2,3,4,5,6,7依次插入初始为空的平衡二叉树T，则T中平衡因子为0的分支结点的个数是（）。\nA. 0\nB. 1\nC. 2\nD. 3',
    mistakeType: '平衡因子计算错误',
    importance: 5,
    correction: '正确答案：D\n解析：依次插入1-7构造AVL树：\n最终形态：根4，左子树2(左1,右3)，右子树6(左5,右7)。\n平衡因子：4的BF=0（左右子树高度都是2）；2的BF=0（左右高度都是1）；6的BF=0（左右高度都是1）。所以平衡因子为0的分支结点有3个：4、2、6。',
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
    id: 'ds_7_17',
    chapterId: 'ch7',
    chapterName: '第七章 查找',
    sectionId: '7.4',
    sectionName: '7.4 B树和B+树',
    title: 'm阶B树性质判断（DS-WD-7.4.3-XT-2）',
    content: '下列关于m阶B树的说法中，错误的是（）。\nA. 根结点至多有m棵子树\nB. 所有叶结点都在同一层次上\nC. 非叶结点至少有m/2（m为偶数）或(m+1)/2（m为奇数）棵子树\nD. 根结点中的数据是有序的',
    mistakeType: 'B树性质理解错误',
    importance: 5,
    correction: '正确答案：C（题目问“错误的是”）\n解析：A正确：根节点最多m棵子树；B正确：B树的叶结点都在同一层；C错误：非叶结点至少有⌈m/2⌉棵子树，不是m/2或(m+1)/2；D正确：B树节点内的关键字有序。注意题目问“错误的是”，所以选C。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'ds_7_18',
    chapterId: 'ch7',
    chapterName: '第七章 查找',
    sectionId: '7.4',
    sectionName: '7.4 B树和B+树',
    title: 'B树插入和删除的分裂合并条件（DS-WD-7.4.3-XT-4）',
    content: '在一棵m阶B树中做插入操作前，若一个结点中的关键字个数等于（），则插入操作后必须分裂成两个结点；在一棵m阶B树中做删除操作前，若一个结点中的关键字个数等于（），则删除操作后可能需要同它的左兄弟或右兄弟结点合并成一个结点。\nA. m, ⌈m/2⌉-2\nB. m-1, ⌈m/2⌉-1\nC. m+1, ⌈m/2⌉\nD. m/2, ⌊m/2+1',
    mistakeType: 'B树分裂合并条件理解错误',
    importance: 5,
    correction: '正确答案：B\n解析：插入：节点最多m-1个关键字，插入后变成m个关键字，超过上限，必须分裂。删除：节点最少⌈m/2⌉-1个关键字，删除后变成⌈m/2⌉-2个，低于下限，可能需要合并。所以插入前是m-1，删除前是m/2⌉-1。',
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
    id: 'ds_7_21',
    chapterId: 'ch7',
    chapterName: '第七章 查找',
    sectionId: '7.4',
    sectionName: '7.4 B树和B+树',
    title: '3阶B树节点数计算（DS-WD-7.4.3-XT-22）',
    content: '【2021统考真题9】在一棵高度为3的3阶B树中，根为第1层，若第2层中有4个关键字，则该树的结点数最多是（）。\nA. 11\nB. 10\nC. 9\nD. 8',
    mistakeType: 'B树结构计算错误',
    importance: 5,
    correction: '正确答案：A\n解析：3阶B树（m=3），每个节点最多2个关键字，3棵子树。第2层有4个关键字，说明第2层有2个节点（每节点2个关键字）。第1层根节点1个。第3层：第2层的2个节点最多各有3棵子树=6个节点。但根节点有关键字将子树分开，要使节点数最多，根节点有1个关键字，分成2棵子树，第2层2个节点，第3层最多2×3=6个节点。总节点数=1+2+6=9？不对，重新计算：根节点1个，第2层2个节点（4个关键字），第3层每个第2层节点最多3棵子树=6个，总共1+2+6=9？答案是11，说明第3层可以有8个节点（2个第2层节点×4棵子树）。所以根节点有2个关键字，第2层有2个节点（4个关键字），第3层2×4=8个节点（不对，3阶最多3棵子树）。正确答案：根节点2个关键字分成3棵子树，第2层3个节点？不，题目说第2层4个关键字。重新分析：根1个，第2层2个节点（每节点2个关键字），第3层最多2×(3-1)+2=8个？总1+2+8=11。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'ds_7_22',
    chapterId: 'ch7',
    chapterName: '第七章 查找',
    sectionId: '7.4',
    sectionName: '7.4 B树和B+树',
    title: 'B树操作性质判断（DS-WD-7.4.3-XT-24）',
    content: '【2023统考真题7】下列关于非空B树的叙述中，正确的是（）。\nI. 插入操作可能增加树的高度\nII. 删除操作一定会导致叶结点的变化\nIII. 查找某关键字总是要查找到叶结点\nIV. 插入的新关键字最终位于叶结点中\nA. 仅I\nB. 仅I、II\nC. 仅III、IV\nD. 仅I、II、IV',
    mistakeType: 'B树操作理解错误',
    importance: 5,
    correction: '正确答案：B\n解析：I正确：根节点分裂时树高增加；II正确：B树删除操作从叶节点开始，一定会影响叶节点；III错误：B树查找可能在非叶节点就找到关键字；IV错误：插入的新关键字先插入叶节点，但分裂时可能上移到非叶节点。所以I和II正确。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'ds_7_23',
    chapterId: 'ch7',
    chapterName: '第七章 查找',
    sectionId: '7.5',
    sectionName: '7.5 散列表',
    title: '散列表聚集原因（DS-WD-7.5.5-XT-9）',
    content: '采用开放定址法解决冲突的散列查找中，发生聚集的原因主要是（）。\nA. 数据元素过多\nB. 负载因子过大\nC. 散列函数选择不当\nD. 解决冲突的方法选择不当',
    mistakeType: '散列表聚集理解错误',
    importance: 4,
    correction: '正确答案：D\n解析：聚集（堆积）是由于解决冲突的方法不当造成的。如线性探测法容易产生一次聚集，二次探测法可以减少聚集但不能完全避免。散列函数不当导致的是同义词冲突多，不是聚集。聚集是指非同义词也发生冲突并堆积在一起。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'ds_7_24',
    chapterId: 'ch7',
    chapterName: '第七章 查找',
    sectionId: '7.5',
    sectionName: '7.5 散列表',
    title: '平方探测法散列表插入（DS-WD-7.5.5-XT-16）',
    content: '现有长度为17、初始为空的散列表HT，散列函数H(key)=key%17，用平方探测法解决冲突：H_i(key)=(H(key)±i²)%17。将关键字序列6,22,7,26,9,23依次插入HT后，则关键字23存放在散列表中的位置是（）。\nA. 0\nB. 2\nC. 6\nD. 15',
    mistakeType: '平方探测法计算错误',
    importance: 5,
    correction: '正确答案：B\n解析：依次插入：\n6→H(6)=6，位置6\n22→H(22)=5，位置5\n7→H(7)=7，位置7\n26→H(26)=9，位置9\n9→H(9)=9冲突，H₁=(9+1)%17=10，位置10\n23→H(23)=6冲突，H₁=(6+1)%17=7冲突，H₂=(6+4)%17=10冲突，H₃=(6-1)%17=5冲突，H₄=(6-4)%17=2，位置2。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'ds_7_25',
    chapterId: 'ch7',
    chapterName: '第七章 查找',
    sectionId: '7.5',
    sectionName: '7.5 散列表',
    title: '提高散列表查找效率的措施（DS-WD-7.5.5-XT-18）',
    content: '【2011统考真题9】为提高散列表的查找效率，可以采取的正确措施是（）。\nI. 增大装填（载）因子\nII. 设计冲突（碰撞）少的散列函数\nIII. 处理冲突（碰撞）时避免产生聚集（堆积）现象\nA. 仅I\nB. 仅II\nC. 仅I、II\nD. 仅II、III',
    mistakeType: '散列表优化理解错误',
    importance: 5,
    correction: '正确答案：D\n解析：I错误：增大装填因子会增加冲突，降低效率；II正确：好的散列函数减少冲突；III正确：避免聚集可以减少冲突链长度。所以II和III正确。装填因子应该控制在合理范围（通常0.6-0.8）。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'ds_7_26',
    chapterId: 'ch7',
    chapterName: '第七章 查找',
    sectionId: '7.5',
    sectionName: '7.5 散列表',
    title: '线性探测法查找失败平均长度（DS-WD-7.5.5-XT-21）',
    content: '【2019统考真题8】现有长度为11且初始为空的散列表HT，散列函数是H(key)=key%7，采用线性探查（线性探测再散列）法解决冲突。将关键字序列87,40,30,6,11,22,98,20依次插入HT后，HT查找失败的平均查找长度是（）。\nA. 4\nB. 5.25\nC. 6\nD. 6.29',
    mistakeType: '散列表查找失败ASL计算错误',
    importance: 5,
    correction: '正确答案：C\n解析：H(key)=key%7，表长11。依次插入：\n87→87%7=3，位置3\n40→40%7=5，位置5\n30→30%7=2，位置2\n6→6%7=6，位置6\n11→11%7=4，位置4\n22→22%7=1，位置1\n98→98%7=0，位置0\n20→20%7=6冲突→7，位置7\n查找失败：对每个H(key)=0-6，计算探查次数直到遇到空位或查完。ASL失败=(各位置失败查找长度之和)/7=42/7=6。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'ds_7_27',
    chapterId: 'ch7',
    chapterName: '第七章 查找',
    sectionId: '7.5',
    sectionName: '7.5 散列表',
    title: '影响散列表平均查找长度的因素（DS-WD-7.5.5-XT-22）',
    content: '【2022统考真题9】下列因素中，影响散列（哈希）方法平均查找长度的是（）。\nI. 装填因子 II. 散列函数 III. 冲突解决策略\nA. 仅I、II\nB. 仅I、III\nC. 仅II、III\nD. I、II、III',
    mistakeType: '散列表性能因素理解错误',
    importance: 5,
    correction: '正确答案：D\n解析：I正确：装填因子α=n/m，影响冲突概率；II正确：散列函数的好坏直接影响冲突次数；III正确：不同的冲突解决策略（线性探测、二次探测、链地址法）查找效率不同。三个因素都影响ASL。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'ds_7_28',
    chapterId: 'ch7',
    chapterName: '第七章 查找',
    sectionId: '7.5',
    sectionName: '7.5 散列表',
    title: '散列冲突处理方法判断（DS-WD-7.5.5-XT-24）',
    content: '【2025统考真题9】下列关于散列方法处理冲突的叙述中，正确的是（）。\nA. 只要散列表不满，线性探查再散列一定能找到一个空闲位置\nB. 只要散列表不满，二次探查再散列一定能找到一个空闲位置\nC. 线性探查再散列处理的冲突，一定是发生在同义词之间的冲突\nD. 二次探查再散列处理的冲突，一定是发生在非同义词之间的冲突',
    mistakeType: '散列冲突处理理解错误',
    importance: 5,
    correction: '正确答案：A\n解析：A正确：线性探测会遍历整个表，只要不满就一定能找到空位；B错误：二次探测不一定能遍历所有位置（取决于表长和增量序列）；C错误：线性探测处理的冲突包括同义词和非同义词；D错误：二次探测也处理两种冲突。线性探测的优势是一定能找到位置（表不满时）。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'ds_7_29',
    chapterId: 'ch7',
    chapterName: '第七章 查找',
    sectionId: '7.5',
    sectionName: '7.5 散列表',
    title: '开放定址法堆积问题（DS-WD-7.5.5-XT-4）',
    content: '在开放定址法中散列到同一个地址而引起的“堆积”问题是由于（）引起的。\nA. 同义词之间发生冲突\nB. 非同义词之间发生冲突\nC. 同义词之间或非同义词之间发生冲突\nD. 散列表“溢出”',
    mistakeType: '堆积问题理解错误',
    importance: 5,
    correction: '正确答案：C\n解析：堆积（聚集）是指多个关键字竞争同一个空位。同义词冲突（哈希值相同）会导致堆积，非同义词冲突（哈希值不同但探测序列重叠）也会导致堆积。所以堆积是同义词或非同义词冲突都可能引起的。堆积会严重降低查找效率。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'ds_8_1',
    chapterId: 'ch8',
    chapterName: '第八章 排序',
    sectionId: '8.1',
    sectionName: '8.1 排序的基本概念',
    title: '排序算法的稳定性(DS-WD-8.1.2-XT-2)',
    content: '排序算法的稳定性是指()。\nA. 经过排序后,能使关键字相同的元素保持原顺序中的相对位置不变\nB. 经过排序后,能使关键字相同的元素保持原顺序中的绝对位置不变\nC. 排序算法的性能与被排序元素个数关系不大\nD. 排序算法的性能与被排序元素的个数关系密切',
    mistakeType: '稳定性概念理解错误',
    importance: 4,
    correction: '正确答案:A\n解析:稳定性是指关键字相同的元素在排序后保持原来的相对顺序。稳定性与性能无关,与绝对位置也无关。稳定排序有利于多关键字排序。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'ds_8_2',
    chapterId: 'ch8',
    chapterName: '第八章 排序',
    sectionId: '8.1',
    sectionName: '8.1 排序的基本概念',
    title: '内部排序与外部排序(DS-WD-8.1.2-XT-1)',
    content: '下述排序算法中,不属于内部排序方法的是()。\nA. 插入排序\nB. 选择排序\nC. 拓扑排序\nD. 冒泡排序',
    mistakeType: '排序分类概念错误',
    importance: 3,
    correction: '正确答案:C\n解析:内部排序是指所有数据都在内存中进行排序。拓扑排序是图论中的概念,用于有向无环图的顶点排序,不属于内部排序。插入排序、选择排序、冒泡排序都是内部排序。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'ds_8_3',
    chapterId: 'ch8',
    chapterName: '第八章 排序',
    sectionId: '8.1',
    sectionName: '8.1 排序的基本概念',
    title: '排序的性质(DS-WD-8.1.2-XT-3)',
    content: '下列关于排序的叙述中,正确的是()。\nA. 稳定的排序方法优于不稳定的排序方法\nB. 对同一线性表使用不同的排序方法进行排序,得到的排序结果可能不同\nC. 排序方法都是在顺序表上实现的,在链表上无法实现排序方法\nD. 在顺序表上实现的排序方法在链表上也可以实现',
    mistakeType: '排序性质理解错误',
    importance: 4,
    correction: '正确答案:B\n解析:A错误,稳定性和不稳定性各有适用场景,不能简单说谁优于谁。B正确,不同排序算法结果可能不同(稳定性的影响)。C错误,链表也可以实现排序。D错误,有些排序(如折半插入)依赖随机访问,链表不支持。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'ds_8_4',
    chapterId: 'ch8',
    chapterName: '第八章 排序',
    sectionId: '8.2',
    sectionName: '8.2 插入排序',
    title: '希尔排序第一趟结果(DS-WD-8.2.4-XT-10)',
    content: '对序列{98, 36, -9, 0, 47, 23, 1, 8, 10, 7}采用希尔排序,下列序列()是增量为4的一趟排序结果。\nA. {10, 7, -9, 0, 47, 23, 1, 8, 98, 36}\nB. {-9, 0, 36, 98, 1, 8, 23, 47, 7, 10}\nC. {36, 98, -9, 0, 23, 47, 1, 8, 7, 10}\nD. 以上都不对',
    mistakeType: '希尔排序过程计算错误',
    importance: 5,
    correction: '正确答案:A\n解析:增量d=4时,分成4组:(98,47,10)、(36,23,7)、(-9,1)、(0,8)。每组分别进行插入排序:(10,47,98)、(7,23,36)、(-9,1)、(0,8)。按原位置放回得到:{10, 7, -9, 0, 47, 23, 1, 8, 98, 36}。',
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
    id: 'ds_8_6',
    chapterId: 'ch8',
    chapterName: '第八章 排序',
    sectionId: '8.2',
    sectionName: '8.2 插入排序',
    title: '折半插入排序时间复杂度(DS-WD-8.2.4-XT-13)',
    content: '折半插入排序算法的时间复杂度为()。\nA. O(n)\nB. O(nlog₂n)\nC. O(n²)\nD. O(n³)',
    mistakeType: '时间复杂度记忆错误',
    importance: 5,
    correction: '正确答案:C\n解析:折半插入排序虽然用二分查找减少了比较次数(从O(n)降到O(log n)),但元素移动次数仍然是O(n),所以总的时间复杂度仍然是O(n²)。注意比较次数和移动次数的区别。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'ds_8_7',
    chapterId: 'ch8',
    chapterName: '第八章 排序',
    sectionId: '8.3',
    sectionName: '8.3 交换排序',
    title: '快速排序一趟划分结果(DS-WD-8.3.3-XT-4)',
    content: '一组记录的关键码为(46, 79, 56, 38, 40, 84),则利用快速排序的方法,以第一个记录为基准,从小到大得到的一次划分结果为()。\nA. (38, 40, 46, 56, 79, 84)\nB. (40, 38, 46, 79, 56, 84)\nC. (40, 38, 46, 56, 79, 84)\nD. (40, 38, 46, 84, 56, 79)',
    mistakeType: '快速排序划分过程计算错误',
    importance: 5,
    correction: '正确答案:C\n解析:以46为基准,从右往左找小于46的数,从左往右找大于46的数,交换。具体过程:84>46不动,40<46交换→(40,79,56,38,46,84);79>46交换38→(40,38,56,79,46,84);56>46不动,38<46已处理。最终基准46在中间,左边都小于46,右边都大于46。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'ds_8_8',
    chapterId: 'ch8',
    chapterName: '第八章 排序',
    sectionId: '8.3',
    sectionName: '8.3 交换排序',
    title: '平均性能最好的排序算法(DS-WD-8.3.3-XT-6)',
    content: '就平均性能而言,目前最好的内部排序算法是()。\nA. 冒泡排序\nB. 直接插入排序\nC. 希尔排序\nD. 快速排序',
    mistakeType: '排序算法性能对比记忆错误',
    importance: 4,
    correction: '正确答案:D\n解析:快速排序平均时间复杂度O(nlog n),常数因子小,实际运行速度最快。冒泡和插入是O(n²),希尔排序平均性能不如快速排序。快速排序在实际应用中是最常用的排序算法之一。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'ds_8_9',
    chapterId: 'ch8',
    chapterName: '第八章 排序',
    sectionId: '8.3',
    sectionName: '8.3 交换排序',
    title: '冒泡排序交换趟数(DS-WD-8.3.3-XT-8)',
    content: '对元素序列{8, 9, 10, 4, 5, 6, 20, 1, 2}采用冒泡排序(从后向前次序进行,要求升序),需要进行元素交换的趟数至少是()。(不考虑无元素交换的最后一趟)\nA. 3\nB. 4\nC. 5\nD. 8',
    mistakeType: '冒泡排序过程模拟错误',
    importance: 4,
    correction: '正确答案:C\n解析:从后向前冒泡,每趟将最小的元素冒到前面。第1趟:1冒到最前;第2趟:2冒到第2位;第3趟:4冒到第3位;第4趟:5冒到第4位;第5趟:6冒到第5位。此时前5个元素{1,2,4,5,6}已有序,后面{8,9,10,20}也有序,共需5趟交换。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'ds_8_10',
    chapterId: 'ch8',
    chapterName: '第八章 排序',
    sectionId: '8.3',
    sectionName: '8.3 交换排序',
    title: '快速排序移动次数最多的序列(DS-WD-8.3.3-XT-11)',
    content: '对下列4个序列,以第一个关键字为基准用快速排序算法进行排序,在第一趟过程中移动记录次数最多的是()。\nA. 92, 96, 88, 42, 30, 35, 110, 100\nB. 92, 96, 100, 110, 42, 35, 30, 88\nC. 100, 96, 92, 35, 30, 110, 88, 42\nD. 42, 30, 35, 92, 100, 96, 88, 110',
    mistakeType: '快速排序过程理解错误',
    importance: 5,
    correction: '正确答案:B\n解析:移动次数取决于有多少元素需要跨越基准元素。B选项中92为基准,右边有100,110都大于92需要移到左边,左边有42,35,30,88都小于92需要移到右边,交叉移动最多。其他选项要么已经相对有序,要么跨越的元素较少。',
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
    id: 'ds_8_12',
    chapterId: 'ch8',
    chapterName: '第八章 排序',
    sectionId: '8.3',
    sectionName: '8.3 交换排序',
    title: '快速排序递归次数（2010统考真题10）',
    content: '【2010统考真题10】采用递归方式对顺序表进行快速排序。下列关于递归次数的叙述中,正确的是()。\nA. 递归次数与初始数据的排列次序无关\nB. 每次划分后,先处理较长的分区可以减少递归次数\nC. 每次划分后,先处理较短的分区可以减少递归次数\nD. 递归次数与每次划分后得到的分区的处理顺序无关',
    mistakeType: '递归次数理解错误',
    importance: 5,
    correction: '正确答案:D\n解析:递归次数取决于划分的平衡性,与处理顺序无关。无论是先处理长分区还是短分区,总的递归调用次数是相同的。递归次数与初始数据排列有关(影响划分平衡性)。',
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
    id: 'ds_8_15',
    chapterId: 'ch8',
    chapterName: '第八章 排序',
    sectionId: '8.4',
    sectionName: '8.4 选择排序',
    title: '堆排序时间复杂度（DS-WD-8.4.3-XT-7）',
    content: '构建n个记录的初始堆,其时间复杂度为();对n个记录进行堆排序,最坏情况下其时间复杂度为()。\nA. O(n), O(nlog₂n)\nB. O(n), O(log₂n)\nC. O(n²), O(log₂n)\nD. O(n²), O(nlog₂n)',
    mistakeType: '堆排序复杂度记忆错误',
    importance: 5,
    correction: '正确答案:A\n解析:建堆时间复杂度是O(n)(从下往上调整,不是O(nlog n))。堆排序最坏情况O(nlog₂n),每次删除堆顶需要O(log n)调整,共n次。注意建堆和排序的复杂度不同。',
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
    id: 'ds_8_17',
    chapterId: 'ch8',
    chapterName: '第八章 排序',
    sectionId: '8.4',
    sectionName: '8.4 选择排序',
    title: '堆调整比较次数（DS-WD-8.4.3-XT-13）',
    content: '已知大根堆{62, 34, 53, 12, 8, 46, 22},删除堆顶元素后需要重新调整堆,则在此过程中关键字的比较次数为()。\nA. 2\nB. 3\nC. 4\nD. 5',
    mistakeType: '堆调整过程理解错误',
    importance: 5,
    correction: '正确答案:B\n解析:删除堆顶62后,将最后一个元素22放到堆顶,然后向下调整。22与左右孩子53和34比较,选较大的53交换(1次比较);然后22与46和22比较,选46交换(2次比较);最后22与12和8比较(3次比较),无需再交换。共3次比较。',
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
    id: 'ds_8_20',
    chapterId: 'ch8',
    chapterName: '第八章 排序',
    sectionId: '8.5',
    sectionName: '8.5 归并排序和基数排序',
    title: '多关键字排序方法（DS-WD-8.5.4-XT-11）',
    content: '设线性表中每个元素有两个数据项k₁和k₂,现对线性表按以下规则进行排序:先看数据项k₁,k₁值小的元素在前,大的元素在后;在k₁值相同的情况下,再看k₂,k₂值小的在前,大的元素在后。满足这种要求的排序方法是()。\nA. 先按k₁进行直接插入排序,再按k₂进行简单选择排序\nB. 先按k₂进行直接插入排序,再按k₁进行简单选择排序\nC. 先按k₁进行简单选择排序,再按k₂进行直接插入排序\nD. 先按k₂进行简单选择排序,再按k₁进行直接插入排序',
    mistakeType: '多关键字排序理解错误',
    importance: 5,
    correction: '正确答案:D\n解析:多关键字排序应该先按次要关键字排序,再按主要关键字排序。而且第二次排序必须用稳定排序才能保证第一次排序的结果不被破坏。直接插入排序是稳定的,简单选择排序是不稳定的。所以先按k₂(次)用不稳定排序,再按k₁(主)用稳定排序。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'ds_8_21',
    chapterId: 'ch8',
    chapterName: '第八章 排序',
    sectionId: '8.5',
    sectionName: '8.5 归并排序和基数排序',
    title: '归并排序时间复杂度（2013统考真题1）',
    content: '【2013统考真题1】已知两个长度分别为m和n的升序链表,若将它们合并为长度为m+n的一个降序链表,则最坏情况下的时间复杂度是()。\nA. O(n)\nB. O(mn)\nC. O(min(m, n))\nD. O(max(m, n))',
    mistakeType: '归并复杂度分析错误',
    importance: 5,
    correction: '正确答案:D\n解析:合并两个有序链表,需要遍历两个链表的所有元素,时间复杂度为O(m+n)。因为O(m+n)=O(max(m,n)),所以答案是D。合并过程不需要嵌套循环,不是O(mn)。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'ds_8_22',
    chapterId: 'ch8',
    chapterName: '第八章 排序',
    sectionId: '8.5',
    sectionName: '8.5 归并排序和基数排序',
    title: '二路归并的功能（2022统考真题10）',
    content: '【2022统考真题10】使用二路归并排序对含n个元素的数组M进行排序时,二路归并操作的功能是()。\nA. 将两个有序表合并为一个新的有序表\nB. 将M划分为两部分,两部分的元素个数大致相等\nC. 将M划分为n个部分,每个部分中仅含有一个元素\nD. 将M划分为两部分,一部分元素的值均小于另一部分元素的值',
    mistakeType: '归并操作概念混淆',
    importance: 5,
    correction: '正确答案:A\n解析:二路归并的核心操作是合并两个有序表为一个有序表。B是分治法的划分步骤,不是归并操作。C是归并排序的初始状态。D是快速排序的划分操作。注意区分归并和划分的概念。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'ds_8_23',
    chapterId: 'ch8',
    chapterName: '第八章 排序',
    sectionId: '8.7',
    sectionName: '8.7 外部排序',
    title: '多路平衡归并的作用（DS-WD-8.7.6-XT-3）',
    content: '多路平衡归并的作用是()。\nA. 减少归并趟数\nB. 减少初始归并段的个数\nC. 便于实现败者树\nD. 以上都对',
    mistakeType: '外部排序概念理解错误',
    importance: 4,
    correction: '正确答案:A\n解析:多路平衡归并可以增加每次归并的路数,从而减少归并的总趟数。不能减少初始归并段个数(由初始数据决定)。与败者树无关。所以只有A正确。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'ds_8_24',
    chapterId: 'ch8',
    chapterName: '第八章 排序',
    sectionId: '8.7',
    sectionName: '8.7 外部排序',
    title: '败者树与堆的比较（DS-WD-8.7.6-XT-10）',
    content: '下列关于小顶堆和败者树的说法中,正确的是()。\nI. 败者树从下往上维护,每上一层,只需和失败结点比较1次\nII. 败者树的每次维护,必定要从叶结点一直走到根结点,不可能从中间停止\nIII. 堆从上往下维护,每下一层,若其左右孩子均不为空,则需比较2次\nIV. 堆的每次维护,必定要从根结点一直走到叶结点,不可能从中间停止\nA. I、III\nB. II、III\nC. I、II、III\nD. I、II、IV',
    mistakeType: '败者树与堆的对比理解错误',
    importance: 5,
    correction: '正确答案:C\n解析:I正确,败者树向上比较只需1次。II正确,败者树必须走到根。III正确,堆向下调整需要比较左右孩子选较大/小的,需2次比较。IV错误,堆调整可能在中间停止(如果孩子都满足堆性质)。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'ds_8_25',
    chapterId: 'ch8',
    chapterName: '第八章 排序',
    sectionId: '8.7',
    sectionName: '8.7 外部排序',
    title: '最佳归并树节点数计算（DS-WD-8.7.6-XT-12）',
    content: '由m个初始归并段构建的k阶最佳归并树中,不需要补充虚段,则度为k的结点个数是()。\nA. (m-1)/k\nB. m/k\nC. (m-1)/(k-1)\nD. 无法确定',
    mistakeType: '归并树计算错误',
    importance: 5,
    correction: '正确答案:C\n解析:k阶最佳归并树是k叉树,只有度为0和k的结点。设度为k的结点数为n_k,度为0的结点数为m(初始归并段)。根据树的性质:m = (k-1)n_k + 1,所以n_k = (m-1)/(k-1)。注意这个公式的推导。',
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
    id: 'ds_8_27',
    chapterId: 'ch8',
    chapterName: '第八章 排序',
    sectionId: '8.6',
    sectionName: '8.6 各种排序算法的比较',
    title: '查找效率最低的数据结构（DS-WD-8.6.3-XT-11）',
    content: '一般情况下,以下查找效率最低的数据结构是()。\nA. 有序顺序表\nB. 二叉排序树\nC. 堆\nD. 平衡二叉树',
    mistakeType: '数据结构查找效率对比错误',
    importance: 4,
    correction: '正确答案:C\n解析:堆的查找效率最低。堆只保证父节点大于(或小于)子节点,不保证左右子树的大小关系,查找任意元素需要遍历,时间复杂度O(n)。有序顺序表可折半查找O(log n),二叉排序树平均O(log n),平衡二叉树O(log n)。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'ds_8_28',
    chapterId: 'ch8',
    chapterName: '第八章 排序',
    sectionId: '8.6',
    sectionName: '8.6 各种排序算法的比较',
    title: '根据排序过程判断算法（2025统考真题11）',
    content: '【2025统考真题11】对含9个关键字的初始序列进行排序,若序列的变化情况如下表所示,则下列排序算法中,采用的是()。\n初始序列: 5, 25, 40, 30, 10, 20, 45, 15, 35\n第1趟排序后的序列: 5, 10, 20, 30, 15, 35, 45, 25, 40\n第2趟排序后的序列: 5, 10, 15, 25, 20, 30, 40, 35, 45\nA. 希尔排序\nB. 基数排序\nC. 归并排序\nD. 折半插入排序',
    mistakeType: '排序算法特征识别错误',
    importance: 5,
    correction: '正确答案:A\n解析:观察第1趟结果,元素跳跃式移动(5不动,25→10,40→20等),这是希尔排序的特征(按增量分组插入)。归并排序会形成局部有序段,基数排序按位排序,折半插入排序相邻移动。只有希尔排序会出现这种跳跃式的元素位置变化。',
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
    id: 'ds_8_30',
    chapterId: 'ch8',
    chapterName: '第八章 排序',
    sectionId: '8.6',
    sectionName: '8.6 各种排序算法的比较',
    title: '根据第二趟结果判断排序算法（2009统考真题10）',
    content: '【2009统考真题10】若数据元素序列{11, 12, 13, 7, 8, 9, 23, 4, 5}是采用下列排序方法之一得到的第二趟排序后的结果,则该排序算法只能是()。\nA. 冒泡排序\nB. 插入排序\nC. 选择排序\nD. 2路归并排序',
    mistakeType: '排序过程特征判断错误',
    importance: 5,
    correction: '正确答案:B\n解析:观察序列,前3个元素{11,12,13}有序,后面无序。这符合插入排序的特征:第2趟后前3个元素有序。冒泡排序第2趟后最后2个元素应该在最终位置。选择排序第2趟后前2个最小元素在最终位置。归并排序会形成多个有序段。只有插入排序符合。',
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    lastReviewAt: '',
    mastered: false
  },
  {
    id: 'ds_8_31',
    chapterId: 'ch8',
    chapterName: '第八章 排序',
    sectionId: '8.6',
    sectionName: '8.6 各种排序算法的比较',
    title: '插入排序与选择排序效率对比（2020统考真题11）',
    content: '【2020统考真题11】对大部分元素已有序的数组排序时,直接插入排序比简单选择排序效率更高,其原因是()。\nI. 直接插入排序过程中元素之间的比较次数更少\nII. 直接插入排序过程中所需的辅助空间更少\nIII. 直接插入排序过程中元素的移动次数更少\nA. 仅I\nB. 仅III\nC. 仅I、II\nD. I、II和III',
    mistakeType: '排序算法效率分析错误',
    importance: 5,
    correction: '正确答案:A\n解析:基本有序时,插入排序比较次数显著减少(O(n)),而选择排序比较次数不变(始终O(n²))。两者辅助空间都是O(1),所以II错误。移动次数方面,插入排序在基本有序时移动也少,但题目强调的是比较次数。所以只有I正确。',
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
    id: 'ds_2_2',
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
    id: 'ds_2_3',
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
    id: 'ds_2_4',
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
    id: 'ds_2_5',
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
    id: 'ds_2_7',
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
    id: 'ds_2_8',
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
