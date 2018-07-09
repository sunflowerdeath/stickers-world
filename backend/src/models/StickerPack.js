import {
	BaseEntity,
	Entity,
	PrimaryGeneratedColumn,
	Column,
	OneToMany,
	ManyToOne
} from 'typeorm'

import User from './User.js'
import Sticker from './Sticker.js'

@Entity()
export default class StickerPack extends BaseEntity {
	@PrimaryGeneratedColumn('uuid')
	id = undefined

	@Column('text')
	name = ''

	@ManyToOne(type => User, user => user.packs)
	user = undefined

	@OneToMany(type => Sticker, sticker => sticker.pack)
	stickers = undefined
}
