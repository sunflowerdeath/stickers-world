import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm'

import StickerPack from './StickerPack.js'

@Entity()
export default class Sticker extends BaseEntity {
	@PrimaryGeneratedColumn('uuid')
	id = undefined

	@Column('text')
	emojis = ''

	@Column('text')
	fileId = ''

	@ManyToOne(type => StickerPack, pack => pack.stickers)
	pack = undefined

}
