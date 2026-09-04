// 王道错题种子数据汇总（计组：错题重练卷90题 + 小程序截图补录3题）
import { WD3400 } from './wd3400'
import { WD3401 } from './wd3401'
import { WD3402 } from './wd3402'
import { WD_EXTRA } from './wdExtra'
import type { WangdaoWrongSeed } from './wdShared'

export type { WangdaoWrongSeed }

export const WANGDAO_CS_SEED: WangdaoWrongSeed[] = [...WD3400, ...WD3401, ...WD3402, ...WD_EXTRA]
