// import {
//   Column,
//   Entity,
//   JoinColumn,
//   // ManyToOne,
//   OneToOne,
//   PrimaryGeneratedColumn,
// } from 'typeorm';
// import { ProductPersonalization } from './productPersonalization';
// // import { Ingredient } from './ingredient';

// @Entity('Personalization')
// export class Personalization {
//   @PrimaryGeneratedColumn()
//   id!: number;

//   @OneToOne(
//     () => ProductPersonalization,
//     (productPersonalization) => productPersonalization.personalization,
//     {
//       onDelete: 'CASCADE',
//       onUpdate: 'CASCADE',
//     },
//   )
//   @JoinColumn([
//     { name: 'productPersonalizationId', referencedColumnName: 'id' },
//   ])
//   productPersonalization!: ProductPersonalization;

//   @ManyToOne(() => Ingredient, (ingredient) => ingredient.personalization)
//   @JoinColumn([{ name: 'ingredientId', referencedColumnName: 'id' }])
//   ingredient!: Ingredient;

//   @Column({ type: 'numeric', precision: 10, scale: 2 })
//   quantity!: number;

//   @Column({ type: 'varchar', length: 255 })
//   note!: string;
// }
