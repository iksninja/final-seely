import { Rating } from "@app/ratings/entities/rating.entity";
import { Score } from "@app/series-suggestions/entities/score.entity";
import { User } from "@app/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity({ name: 'series_suggestions'})
export class SeriesSuggestion {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    year: string;

    @Column()
    description: string;

    @ManyToOne( () => Rating)
    @JoinColumn({ name: 'rating_id', referencedColumnName: 'id'})
    rating: Rating;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'username', referencedColumnName: 'username' })
    user: User;

    //@ManyToOne( () => Score)
    //@JoinColumn({ name: 'score_id', referencedColumnName: 'id'})
    @Column({ type: 'int', nullable: true })
    score: number;

    @Column({ type:'float', default:0 })
    avgScore: number;

    @Column({ type: 'int', default: 0 })
    scoreCount: number;

}
