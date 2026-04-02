import type { IProject } from '@/models/Project'
import type { IDesignThought } from '@/models/DesignThought'
import type { ITool } from '@/models/Tool'
import type { IProfile } from '@/models/Profile'
import type { ICertification } from '@/models/Certification'
import type { IContactMessage } from '@/models/ContactMessage'

/**
 * After serialize(), _id (BSON ObjectId) becomes a plain string
 * and Date fields become ISO strings.
 */
export type Serialized<T> = {
  [K in keyof T]: T[K] extends Date
    ? string
    : T[K] extends Date | null
    ? string | null
    : T[K]
} & { _id: string }

export type SerializedProject       = Serialized<IProject>
export type SerializedThought       = Serialized<IDesignThought>
export type SerializedTool          = Serialized<ITool>
export type SerializedProfile       = Serialized<IProfile>
export type SerializedCertification = Serialized<ICertification>
export type SerializedContactMessage = Serialized<IContactMessage> & {
  createdAt: string
  updatedAt: string
}
