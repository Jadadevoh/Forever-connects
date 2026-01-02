import { Memorial } from '../types';

export const sampleMemorials: Memorial[] = [
    {
        id: 'mem_sample_001',
        slug: 'evelyn-rose-bennett-2023',
        firstName: 'Evelyn',
        middleName: 'Rose',
        lastName: 'Bennett',
        birthDate: '1945-06-12',
        deathDate: '2023-11-04',
        gender: 'Female',
        city: 'Savannah',
        state: 'GA',
        country: 'United States',
        causeOfDeath: ['Natural Causes'],
        isCauseOfDeathPrivate: false,
        profileImage: {
            id: 'sample_img_001',
            url: 'https://images.unsplash.com/photo-1551843073-4a9a5b6fcd5f?q=80&w=987&auto=format&fit=crop',
            caption: 'Evelyn in her garden, 2020'
        },
        biography: `<p>Evelyn Rose Bennett was a beacon of grace and warmth to all who knew her. Born in the heart of Savannah, Georgia, she grew up with a deep love for the natural world, a passion she carried throughout her life.</p>
        <p>As a schoolteacher for over 40 years, Evelyn touched the lives of countless children, instilling in them not just knowledge, but confidence and kindness. She had a unique ability to make every student feel special and heard.</p>
        <p>Her family was her pride and joy. She was a devoted wife to Robert for 52 years, a loving mother to Sarah and Michael, and a doting grandmother to four beautiful grandchildren. Her Sunday dinners were legendary, filled with laughter, storytelling, and her famous peach cobbler.</p>
        <p>Evelyn was also an avid gardener. Her roses were the envy of the neighborhood, and she found great peace tending to them. She believed that patience and care could make anything bloom—a philosophy she applied to both her garden and her relationships.</p>
        <p>Though she is no longer with us, her spirit lives on in the beautiful family she raised and the many lives she enriched. She will be deeply missed but forever remembered.</p>`,
        gallery: [
            { id: 'gal_001', type: 'image', url: 'https://images.unsplash.com/photo-1551843073-4a9a5b6fcd5f?q=80&w=987&auto=format&fit=crop', caption: 'Portrait', fileName: 'portrait.jpg' },
            { id: 'gal_002', type: 'image', url: 'https://plus.unsplash.com/premium_photo-1664124381832-72719665bc3c?q=80&w=1170&auto=format&fit=crop', caption: 'The Garden', fileName: 'garden.jpg' }
        ],
        tributes: [
            { id: 'trib_001', author: 'Sarah Bennett', message: 'Mom, you were my best friend and my rock. I miss you every single day.', createdAt: 1700000000000, likes: 12 },
            { id: 'trib_002', author: 'The Wilson Family', message: 'Evelyn was a true treasure. Our thoughts are with the family.', createdAt: 1700100000000, likes: 5 }
        ],
        theme: 'classic-rose-classic',
        plan: 'premium',
        donationInfo: { isEnabled: true, recipient: 'St. Jude Children\'s Hospital', goal: 5000, description: 'Donations in lieu of flowers will support pediatric research, a cause close to Evelyn\'s heart.', showDonorWall: true, suggestedAmounts: [25, 50, 100], purpose: 'Charitable Cause in their Name' },
        donations: [],
        emailSettings: { senderName: 'Evelyn Bennett Tribute', replyToEmail: '', headerImageUrl: '', footerMessage: 'In loving memory.' },
        status: 'active',
        createdAt: 1699100000000
    },
    {
        id: 'mem_sample_002',
        slug: 'james-arthur-wright',
        firstName: 'James',
        middleName: 'Arthur',
        lastName: 'Wright',
        birthDate: '1980-03-15',
        deathDate: '2023-09-20',
        gender: 'Male',
        city: 'Seattle',
        state: 'WA',
        country: 'United States',
        causeOfDeath: ['Accident'],
        isCauseOfDeathPrivate: false,
        profileImage: {
            id: 'sample_img_002',
            url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=987&auto=format&fit=crop',
            caption: 'James hiking, 2022'
        },
        biography: `<p>James Arthur Wright lived life at full volume. An adventurer at heart, he never met a mountain he didn't want to climb or a river he didn't want to cross.</p>
        <p>Working as a software engineer in Seattle, James was brilliant and innovative, but his true passion lay outdoors. He was an experienced alpinist and a mentor to many in the climbing community. He taught us that fear is just a feeling, but courage is a choice.</p>
        <p>James was known for his infectious laugh and his bear hugs. He was a loyal friend who would drop everything to help someone in need. His generosity knew no bounds.</p>
        <p>He leaves behind his parents, his sister Emily, and his faithful dog, Summit. While his time with us was far too short, the impact he made was immeasurable. Keep climbing, James.</p>`,
        gallery: [
            { id: 'gal_003', type: 'image', url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=987&auto=format&fit=crop', caption: 'Summit Day', fileName: 'summit.jpg' },
            { id: 'gal_004', type: 'image', url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1170&auto=format&fit=crop', caption: 'At the cabin', fileName: 'cabin.jpg' }
        ],
        tributes: [
            { id: 'trib_003', author: 'Mark', message: 'Climb on, brother. See you at the top.', createdAt: 1695500000000, likes: 24 }
        ],
        theme: 'modern-blue-story',
        plan: 'free',
        donationInfo: { isEnabled: false, recipient: '', goal: 0, description: '', showDonorWall: false, suggestedAmounts: [], purpose: '' },
        donations: [],
        emailSettings: { senderName: 'James Wright Memorial', replyToEmail: '', headerImageUrl: '', footerMessage: 'Adventure is out there.' },
        status: 'active',
        createdAt: 1695200000000
    },
    {
        id: 'mem_sample_003',
        slug: 'mariana-sofia-lopez',
        firstName: 'Mariana',
        middleName: 'Sofia',
        lastName: 'Lopez',
        birthDate: '1955-08-22',
        deathDate: '2024-01-10',
        gender: 'Female',
        city: 'Austin',
        state: 'TX',
        country: 'United States',
        causeOfDeath: ['Cancer'],
        isCauseOfDeathPrivate: true,
        profileImage: {
            id: 'sample_img_003',
            url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=988&auto=format&fit=crop',
            caption: 'Mariana at her studio'
        },
        biography: `<p>Mariana Sofia Lopez was an artist whose canvas was the world around her. With a paintbrush in hand, she could capture the beauty of a sunset or the soul of a stranger.</p>
        <p>Born in Mexico City, she moved to Austin in her twenties and quickly became a beloved fixture in the local art scene. Her gallery, 'Colores de Vida', was a gathering place for creatives and dreamers.</p>
        <p>She fought her illness with the same fierce grace she applied to her art. She never lost her smile or her desire to create beauty. She is survived by her husband, Carlos, and their three daughters.</p>
        <p>Mariana's legacy is painted in vibrant colors across our city and in the hearts of everyone she met. Do not mourn her with black; celebrate her with every color of the rainbow.</p>`,
        gallery: [
            { id: 'gal_005', type: 'image', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=988&auto=format&fit=crop', caption: 'Portrait', fileName: 'portrait.jpg' },
            { id: 'gal_006', type: 'image', url: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=1080&auto=format&fit=crop', caption: 'Her Studio', fileName: 'studio.jpg' }
        ],
        tributes: [],
        theme: 'elegant-gold-classic',
        plan: 'premium',
        donationInfo: { isEnabled: true, recipient: 'Arts for All', goal: 10000, description: 'Scholarship fund for young artists.', showDonorWall: true, suggestedAmounts: [50, 100, 500], purpose: 'Charitable Cause in their Name' },
        donations: [],
        emailSettings: { senderName: 'Mariana Lopez Tribute', replyToEmail: '', headerImageUrl: '', footerMessage: 'Life is art.' },
        status: 'active',
        createdAt: 1704900000000
    },
    {
        id: 'mem_sample_004',
        slug: 'dr-michael-chang',
        firstName: 'Michael',
        middleName: '',
        lastName: 'Chang',
        birthDate: '1962-11-30',
        deathDate: '2023-12-15',
        gender: 'Male',
        city: 'Boston',
        state: 'MA',
        country: 'United States',
        causeOfDeath: ['Heart Attack'],
        isCauseOfDeathPrivate: false,
        profileImage: {
            id: 'sample_img_004',
            url: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=987&auto=format&fit=crop',
            caption: 'Dr. Chang accepting his award'
        },
        biography: `<p>Dr. Michael Chang was a healer, a mentor, and a visionary. As Chief of Cardiology at City General, he saved countless lives and pioneered minimally invasive techniques that are now used worldwide.</p>
        <p>But to his patients, he wasn't just a surgeon; he was the man who held their hand before a procedure and sat with their families afterwards. His compassion was as legendary as his skill.</p>
        <p>When he wasn't at the hospital, Michael could be found fishing on the Cape or playing chess with his grandson. He was a man of quiet intelligence and deep kindness.</p>
        <p>The medical community has lost a giant, and his family has lost their anchor. His contributions to medicine will endure for generations.</p>`,
        gallery: [
            { id: 'gal_007', type: 'image', url: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=987&auto=format&fit=crop', caption: 'Profile', fileName: 'profile.jpg' }
        ],
        tributes: [
            { id: 'trib_005', author: 'A grateful patient', message: 'He gave me 10 more years with my family. I will never forget him.', createdAt: 1702700000000, likes: 45 }
        ],
        theme: 'peaceful-green-classic',
        plan: 'eternal',
        donationInfo: { isEnabled: true, recipient: 'Heart Health Foundation', goal: 25000, description: 'Research funding.', showDonorWall: true, suggestedAmounts: [100, 250, 1000], purpose: 'Medical Bills' },
        donations: [],
        emailSettings: { senderName: 'Chang Family', replyToEmail: '', headerImageUrl: '', footerMessage: 'With gratitude.' },
        status: 'active',
        createdAt: 1702600000000
    },
    {
        id: 'mem_sample_005',
        slug: 'liam-thomas-odonnell',
        firstName: 'Liam',
        middleName: 'Thomas',
        lastName: 'O\'Donnell',
        birthDate: '2005-04-10',
        deathDate: '2023-08-05',
        gender: 'Male',
        city: 'Chicago',
        state: 'IL',
        country: 'United States',
        causeOfDeath: ['Accident'],
        isCauseOfDeathPrivate: false,
        profileImage: {
            id: 'sample_img_005',
            url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=987&auto=format&fit=crop',
            caption: 'Liam senior portrait'
        },
        biography: `<p>Liam was a bright light extinguished too soon. At only 18, he had a smile that could light up a stadium and a heart big enough to hold the world.</p>
        <p>A star athlete and an honor student, Liam was set to start college in the fall. He loved basketball, graphic novels, and playing guitar in his garage band, 'The Echoes'.</p>
        <p>He was the protector of his younger siblings and the joy of his parents' lives. He taught us to live in the moment and to never take a single day for granted.</p>
        <p>Fly high, Liam. We will look for you in the stars.</p>`,
        gallery: [],
        tributes: [
            { id: 'trib_006', author: 'Coach Miller', message: 'Best point guard I ever coached. Miss you, kid.', createdAt: 1691300000000, likes: 88 },
            { id: 'trib_007', author: 'Jenna', message: 'Prom won\'t be the same without you.', createdAt: 1691400000000, likes: 32 }
        ],
        theme: 'modern-blue-classic',
        plan: 'free',
        donationInfo: { isEnabled: true, recipient: 'Liam O\'Donnell Scholarship Fund', goal: 5000, description: 'Helping student athletes.', showDonorWall: true, suggestedAmounts: [20, 50, 100], purpose: 'Education Fund for Children' },
        donations: [],
        emailSettings: { senderName: 'Friends of Liam', replyToEmail: '', headerImageUrl: '', footerMessage: 'Forever young.' },
        status: 'active',
        createdAt: 1691200000000
    }
];
