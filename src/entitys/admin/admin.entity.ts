import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export type Role = 'admin' | 'super_admin'
interface IAdminEntityOption {
    user_id: number,
    role: Role
}

@Entity('sc_admin_relation')
export class AdminEntity {

    @PrimaryGeneratedColumn()
    id: number

    @Column({
        unique: true
    })
    user_id: number

    @Column({
        length: 20,
        type: 'varchar'
    })
    role: Role // admin || super_admin

    constructor(option?: IAdminEntityOption) {
        if (option) {
            this.user_id = option.user_id
            this.role = option.role
        }
    }
}