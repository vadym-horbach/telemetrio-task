import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Exclude, Expose, plainToInstance } from 'class-transformer'

@Exclude()
@Schema({
  _id: false,
  timestamps: true,
  toObject: {
    virtuals: true,
  },
  toJSON: {
    virtuals: true,
    transform: (doc, res) => {
      return plainToInstance(WhereFind, res)
    },
  },
})
class WhereFind {
  @Expose()
  @Prop({ required: true, default: false })
  chats!: boolean

  @Expose()
  @Prop({ required: true, default: false })
  channels!: boolean
}

const WhereFindSchema = SchemaFactory.createForClass(WhereFind)

export { WhereFind, WhereFindSchema }
