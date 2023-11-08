import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { IUser } from 'common/contracts';

@Entity({ name: 'users' })
export class User implements IUser {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column('varchar', {
    length: 12,
  })
  public login!: string;

  @Column('varchar', {
    length: 255,
  })
  public password!: string;

  @Column('boolean', {
    name: 'use_ldap',
    default: false,
  })
  public useLDAP = false;
}
