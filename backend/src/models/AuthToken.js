import { BaseEntity, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm'

import User from './User.js'

@Entity()
export default class AuthToken extends BaseEntity {
	@PrimaryGeneratedColumn('uuid')
	id = undefined

	@ManyToOne(type => User, user => user.tokens)
	user = undefined
}
