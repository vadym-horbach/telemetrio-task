import type { Types } from 'mongoose'

export type T_CreatePartial<T> = Omit<
  {
    [P in keyof T]?: T[P] extends Types.ObjectId | undefined
      ? Types.ObjectId | string
      : T[P] extends Date | undefined
      ? Date | number
      : T[P] extends Types.ObjectId[] | undefined
      ? (Types.ObjectId | string)[]
      : T[P]
  },
  '_id' | 'id'
>

export interface I_DeleteResult {
  /** Indicates whether this write result was acknowledged. If not, then all other members of this result will be undefined. */
  acknowledged: boolean
  /** The number of documents that were deleted */
  deletedCount: number
}
