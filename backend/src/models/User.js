import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'

import AuthToken from './AuthToken.js'
import StickerPack from './StickerPack.js'

@Entity()
export default class User extends BaseEntity {
	@PrimaryGeneratedColumn('uuid')
	id = undefined

	@Column('text')
	name = ''

	@Column('text')
	telegramUserId = ''

	@OneToMany(type => StickerPack, pack => pack.user)
	packs = undefined

	@OneToMany(type => AuthToken, token => token.user)
	tokens = undefined
}
