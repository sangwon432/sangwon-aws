import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../common/base.entity';

@Entity()
export class Blog extends BaseEntity {
  @Column()
  public title: string;

  @Column()
  public desc: string;

  @Column()
  public category: string;

  @Column()
  public author: string;

  @Column()
  public image: string;

  //title, description, category, author, image
  // uuid, 생성날짜, 삭제날짜 base entity로 빼기
}
