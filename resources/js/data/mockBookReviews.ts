export interface MockReviewSeed {
    author: string;
    content: string;
    rating: number;
    avatar: string;
}

export const MOCK_BOOK_REVIEW_POOL: MockReviewSeed[] = [
    { author: 'Ava', avatar: 'AV', rating: 5, content: 'Super clear and easy to follow. I felt like the difficult ideas were finally explained in plain language.' },
    { author: 'Noah', avatar: 'NO', rating: 5, content: 'One of the best learning resources I have used. Very structured and motivating from start to finish.' },
    { author: 'Mia', avatar: 'MI', rating: 5, content: 'Excellent examples and strong pacing. I would absolutely recommend this to beginners.' },
    { author: 'Liam', avatar: 'LI', rating: 5, content: 'This made the topic feel much less intimidating. The step by step approach really helped.' },
    { author: 'Emma', avatar: 'EM', rating: 5, content: 'Great balance between explanation and practice. It never felt too overwhelming.' },
    { author: 'Ethan', avatar: 'ET', rating: 5, content: 'Very polished and useful. The explanations felt thoughtful instead of rushed.' },
    { author: 'Sophia', avatar: 'SO', rating: 5, content: 'I liked how approachable it was. It gave me confidence to keep studying the subject.' },
    { author: 'Lucas', avatar: 'LU', rating: 5, content: 'Strong teaching style and great flow. It felt well organized from the start.' },

    { author: 'Isabella', avatar: 'IS', rating: 4, content: 'Really solid overall. A few sections moved fast, but most of it was very helpful.' },
    { author: 'Mason', avatar: 'MA', rating: 4, content: 'Good resource with strong explanations. I just wish there were a few more practice examples.' },
    { author: 'Charlotte', avatar: 'CH', rating: 4, content: 'Helpful and worth the time. It explains concepts well, even if a few parts feel dense.' },
    { author: 'Logan', avatar: 'LO', rating: 4, content: 'I learned a lot from this. It is not perfect, but it is definitely useful.' },
    { author: 'Amelia', avatar: 'AM', rating: 4, content: 'Pretty effective for self study. Some sections could be clearer, but overall it works well.' },
    { author: 'James', avatar: 'JA', rating: 4, content: 'Good explanations and decent structure. I would use it again as a review resource.' },
    { author: 'Harper', avatar: 'HA', rating: 4, content: 'I liked it more than I expected. It was readable and mostly easy to understand.' },
    { author: 'Benjamin', avatar: 'BE', rating: 4, content: 'Strong resource overall. Some chapters were better than others, but the quality is good.' },

    { author: 'Evelyn', avatar: 'EV', rating: 3, content: 'It is okay. Some parts helped me, but other sections felt too vague or too fast.' },
    { author: 'Elijah', avatar: 'EL', rating: 3, content: 'Average experience. It has useful ideas, but I needed outside help to fully understand everything.' },
    { author: 'Abigail', avatar: 'AB', rating: 3, content: 'Not bad, but not amazing either. It works better as a supplement than as a main resource.' },
    { author: 'Jacob', avatar: 'JC', rating: 3, content: 'Mixed feelings. A few explanations were strong, but others were confusing.' },
    { author: 'Emily', avatar: 'EY', rating: 3, content: 'It covers the basics, but I wanted more clarity and more examples.' },
    { author: 'Michael', avatar: 'MC', rating: 3, content: 'Usable, but inconsistent. Some sections are well done and others feel rushed.' },
    { author: 'Elizabeth', avatar: 'EZ', rating: 3, content: 'I could learn from it, but it did not fully click for me.' },
    { author: 'Daniel', avatar: 'DA', rating: 3, content: 'Fairly average. It is not terrible, but I would not say it stands out.' },

    { author: 'Sofia', avatar: 'SF', rating: 2, content: 'I struggled with this a lot. The explanations were not clear enough for a beginner.' },
    { author: 'Henry', avatar: 'HE', rating: 2, content: 'Too much was assumed. I felt lost pretty early and had to look elsewhere.' },
    { author: 'Ella', avatar: 'EA', rating: 2, content: 'There are some decent parts, but overall it was harder to follow than it should have been.' },
    { author: 'Jackson', avatar: 'JK', rating: 2, content: 'The pacing felt off and the examples did not help enough.' },
    { author: 'Scarlett', avatar: 'SC', rating: 2, content: 'I wanted to like it, but it just did not explain the material clearly enough.' },
    { author: 'Sebastian', avatar: 'SE', rating: 2, content: 'Some useful information is there, but the teaching style did not work for me.' },
    { author: 'Grace', avatar: 'GR', rating: 2, content: 'Too confusing in key places. It made the topic feel harder than it needed to be.' },
    { author: 'Aiden', avatar: 'AI', rating: 2, content: 'Not great for learning from scratch. I needed another resource almost immediately.' },

    { author: 'Chloe', avatar: 'CL', rating: 1, content: 'Very frustrating. It did not explain things in a way that made sense to me at all.' },
    { author: 'Matthew', avatar: 'MT', rating: 1, content: 'I learned almost nothing from this. It felt disorganized and unclear.' },
    { author: 'Victoria', avatar: 'VI', rating: 1, content: 'Bad experience. The examples were weak and the explanations were harder than the topic itself.' },
    { author: 'Samuel', avatar: 'SM', rating: 1, content: 'I would not recommend this. It was confusing from beginning to end.' },
    { author: 'Riley', avatar: 'RI', rating: 1, content: 'This made me more confused than before I started.' },
    { author: 'David', avatar: 'DV', rating: 1, content: 'Poorly explained and not helpful for studying.' },
    { author: 'Lily', avatar: 'LY', rating: 1, content: 'I gave up on this quickly. It just was not teaching the material well.' },
    { author: 'Joseph', avatar: 'JO', rating: 1, content: 'Very weak learning resource. I would tell people to avoid it.' },
];