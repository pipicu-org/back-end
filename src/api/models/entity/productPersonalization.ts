// import {
//   Entity,
//   JoinColumn,
//   ManyToOne,
//   OneToOne,
//   PrimaryGeneratedColumn,
// } from 'typeorm';
// import { Product } from './product';
// import { Line } from './line';
// import { Personalization } from './personalization';

// @Entity('ProductPersonalization')
// export class ProductPersonalization {
//   @PrimaryGeneratedColumn()
//   id!: number;

//   @ManyToOne(() => Product, (product) => product.personalizations, {
//     nullable: false,
//   })
//   @JoinColumn([{ name: 'productId', referencedColumnName: 'id' }])
//   product!: Product;

//   @ManyToOne(() => Line, (line) => line.personalizations, {
//     onDelete: 'CASCADE',
//     nullable: false,
//   })
//   @JoinColumn([{ name: 'lineId', referencedColumnName: 'id' }])
//   line!: Line;

//   @OneToOne(
//     () => Personalization,
//     (personalization) => personalization.productPersonalization,
//     {
//       nullable: false,
//       onDelete: 'CASCADE',
//       onUpdate: 'CASCADE',
//       cascade: ['insert', 'update'],
//     },
//   )
//   personalization!: Personalization;
// }
