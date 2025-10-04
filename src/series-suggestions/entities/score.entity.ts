import { SeriesSuggestion } from "@app/series-suggestions/entities/series-suggestion.entity";
import { User } from "@app/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity('scores')
@Unique(['user', 'seriesSuggestion'])
export class Score {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'int' })
    score: number;

    @ManyToOne(() => SeriesSuggestion, suggestion => suggestion.scores, {
        onDelete: 'CASCADE',
    })
    seriesSuggestion: SeriesSuggestion;

    @ManyToOne(() => User, { nullable: false })
    @JoinColumn({ name: 'username', referencedColumnName: 'username' })
    user: User;

}
