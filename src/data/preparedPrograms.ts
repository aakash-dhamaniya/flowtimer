import { PreparedProgram } from '../types/meditation';

export const PREPARED_PROGRAMS: PreparedProgram[] = [
  {
    id: 'prog-kundalini-jagran',
    title: 'Kundalini Jagran Sadhana',
    sanskritTitle: 'कुण्डलिनी जागरण साधना',
    subtitle: 'Chakra Activation, Mula Bandha & Sushumna Prana Flow',
    description: 'A traditional classical tantric and hatha kriya sequence designed to awaken the dormant bio-spiritual energy at the base of the spine (Muladhara) and channel it upward along the Sushumna Nadi to the Crown (Sahasrara).',
    category: 'kundalini',
    categoryLabel: 'Kundalini & Chakras',
    badge: 'Sacred Kriya',
    accentColor: 'amber',
    difficulty: 'Advanced',
    bestTime: 'Brahma Muhurta (4:00 AM - 6:00 AM) or Dawn',
    chakra: 'Muladhara to Sahasrara',
    mudra: 'Jnana Mudra & Khechari Mudra',
    benefits: [
      'Awakens dormant spiritual energy along the spinal axis',
      'Purifies the subtle nervous pathways (Ida, Pingala, Sushumna)',
      'Intensifies pranic heat and internal awareness',
      'Expands consciousness into meditative stillness (Dhyana)'
    ],
    precautions: [
      'Practice strictly on an empty stomach (3-4 hours after meals)',
      'Keep your spine comfortably straight throughout',
      'Do not force breath retention if feeling dizzy or agitated'
    ],
    stages: [
      {
        id: 'kj-1-prep',
        title: 'Asana Sthiti & Sankalpa',
        durationSeconds: 120,
        chimeType: 'om',
        speakTitle: true,
        customAnnouncement: 'Settle into Siddhasana or Padmasana. Align your spine. Three deep breaths.'
      },
      {
        id: 'kj-2-agnisar',
        type: 'repeat',
        title: 'Agnisar Kriya & Mula Bandha',
        durationSeconds: 24,
        chimeType: 'bell',
        speakTitle: true,
        repeatMode: 'count',
        repeatCount: 4,
        nestedStages: [
          { id: 'kj-agn-exh', title: 'Exhale Completely & Hold Out', durationSeconds: 6, chimeType: 'bell', speakTitle: true },
          { id: 'kj-agn-flap', title: 'Abdominal Flaps & Root Lock (Mula Bandha)', durationSeconds: 12, chimeType: 'bell', speakTitle: true },
          { id: 'kj-agn-rec', title: 'Slow Deep Recovery Inhale', durationSeconds: 6, chimeType: 'bell', speakTitle: true }
        ]
      },
      {
        id: 'kj-3-bhastrika',
        type: 'repeat',
        title: 'Bhastrika (Bellows of Fire)',
        durationSeconds: 45,
        chimeType: 'bell',
        speakTitle: true,
        repeatMode: 'count',
        repeatCount: 3,
        nestedStages: [
          { id: 'kj-bhas-pmp', title: 'Rapid Bellows Breathing (20 Strokes)', durationSeconds: 20, chimeType: 'bell', speakTitle: true },
          { id: 'kj-bhas-hld', title: 'Deep Inhale & Antar Kumbhaka (Throat Lock)', durationSeconds: 15, chimeType: 'bell', speakTitle: true },
          { id: 'kj-bhas-rel', title: 'Slow Controlled Exhale & Rest', durationSeconds: 10, chimeType: 'bell', speakTitle: true }
        ]
      },
      {
        id: 'kj-4-nadi',
        type: 'repeat',
        title: 'Nadi Shodhana with Kumbhaka',
        durationSeconds: 40,
        chimeType: 'bell',
        speakTitle: true,
        repeatMode: 'count',
        repeatCount: 4,
        nestedStages: [
          { id: 'kj-ns-inl', title: 'Inhale Left (Ida Nadi)', durationSeconds: 4, chimeType: 'bell', speakTitle: true },
          { id: 'kj-ns-hld1', title: 'Antar Kumbhaka (Hold with Root Lock)', durationSeconds: 12, chimeType: 'bell', speakTitle: true },
          { id: 'kj-ns-exr', title: 'Exhale Right (Pingala)', durationSeconds: 8, chimeType: 'bell', speakTitle: true },
          { id: 'kj-ns-inr', title: 'Inhale Right (Pingala)', durationSeconds: 4, chimeType: 'bell', speakTitle: true },
          { id: 'kj-ns-hld2', title: 'Antar Kumbhaka (Hold with Root Lock)', durationSeconds: 12, chimeType: 'bell', speakTitle: true }
        ]
      },
      {
        id: 'kj-5-sushumna',
        title: 'Sushumna Prana Sanchara',
        durationSeconds: 300,
        chimeType: 'om',
        speakTitle: true,
        customAnnouncement: 'Feel the golden column of light ascending from the base of the spine up to the crown.'
      },
      {
        id: 'kj-6-samadhi',
        title: 'Sahasrara Dhyan & Silent Samadhi',
        durationSeconds: 360,
        chimeType: 'singing-bowl',
        speakTitle: true,
        customAnnouncement: 'Rest your awareness in pure stillness at the crown of your head.'
      }
    ]
  },
  {
    id: 'prog-memory-enhancement',
    title: 'Smriti & Medha Vardhak Sadhana',
    sanskritTitle: 'स्मृति एवं मेधा वर्धक साधना',
    subtitle: 'Brain Power, Neuroplasticity & Memory Retention',
    description: 'A scientifically validated yogic protocol that optimizes cerebral blood flow, stimulates nitric oxide release via Bhramari, balances brain hemispheres with Anulom Vilom, and activates the prefrontal cortex.',
    category: 'memory',
    categoryLabel: 'Memory & Brain',
    badge: 'Neuro-Focus',
    accentColor: 'indigo',
    difficulty: 'All Levels',
    bestTime: 'Morning or Before Study / Deep Knowledge Work',
    chakra: 'Ajna Chakra (Third Eye)',
    mudra: 'Shanmukhi Mudra & Hakini Mudra',
    benefits: [
      'Increases cerebral perfusion and frontal lobe oxygenation',
      'Stimulates high-amplitude gamma and theta brainwaves',
      'Enhances recall speed, memory consolidation, and mental stamina',
      'Dissolves brain fog, mental fatigue, and restlessness'
    ],
    precautions: [
      'Maintain steady, effortless posture without neck strain',
      'During Bhramari, keep the teeth slightly separated to allow natural skull vibration'
    ],
    stages: [
      {
        id: 'sm-1-cranial',
        title: 'Griva & Netra Sanchalana (Cranial Blood Flow)',
        durationSeconds: 120,
        chimeType: 'bell',
        speakTitle: true,
        customAnnouncement: 'Gentle neck and ocular circulation prep to open cerebral blood vessels.'
      },
      {
        id: 'sm-2-kapala',
        type: 'repeat',
        title: 'Kapalabhati (Frontal Brain Cleansing)',
        durationSeconds: 50,
        chimeType: 'bell',
        speakTitle: true,
        repeatMode: 'count',
        repeatCount: 3,
        nestedStages: [
          { id: 'sm-kap-pump', title: 'Rhythmic Abdominal Exhalations (30 Strokes)', durationSeconds: 30, chimeType: 'bell', speakTitle: true },
          { id: 'sm-kap-hold', title: 'Deep Inhale & Gentle Stillness Hold', durationSeconds: 12, chimeType: 'bell', speakTitle: true },
          { id: 'sm-kap-rel', title: 'Soft Exhale & Normal Breath', durationSeconds: 8, chimeType: 'bell', speakTitle: true }
        ]
      },
      {
        id: 'sm-3-anulom',
        type: 'repeat',
        title: 'Anulom Vilom (Hemispheric Synchronization)',
        durationSeconds: 30,
        chimeType: 'bell',
        speakTitle: true,
        repeatMode: 'count',
        repeatCount: 6,
        nestedStages: [
          { id: 'sm-av-inl', title: 'Inhale Left Nostril (Calm/Creative)', durationSeconds: 5, chimeType: 'bell', speakTitle: true },
          { id: 'sm-av-exr', title: 'Exhale Right Nostril (Logical/Analytical)', durationSeconds: 10, chimeType: 'bell', speakTitle: true },
          { id: 'sm-av-inr', title: 'Inhale Right Nostril', durationSeconds: 5, chimeType: 'bell', speakTitle: true },
          { id: 'sm-av-exl', title: 'Exhale Left Nostril', durationSeconds: 10, chimeType: 'bell', speakTitle: true }
        ]
      },
      {
        id: 'sm-4-bhramari',
        type: 'repeat',
        title: 'Bhramari with Shanmukhi Mudra',
        durationSeconds: 18,
        chimeType: 'bell',
        speakTitle: true,
        repeatMode: 'count',
        repeatCount: 6,
        nestedStages: [
          { id: 'sm-bhr-in', title: 'Deep Smooth Inhale', durationSeconds: 4, chimeType: 'bell', speakTitle: true },
          { id: 'sm-bhr-hum', title: 'Shanmukhi Mudra Humming Exhale (Feel Cranial Resonance)', durationSeconds: 14, chimeType: 'bell', speakTitle: true }
        ]
      },
      {
        id: 'sm-5-omkar',
        title: 'Omkar Dhwani & Vagal Stimulation',
        durationSeconds: 180,
        chimeType: 'om',
        speakTitle: true,
        customAnnouncement: 'Chant A-U-M continuously. Feel the vibration traveling up your spine into the brain.'
      },
      {
        id: 'sm-6-ajna',
        title: 'Shambhavi Mudra (Third Eye Dhyan)',
        durationSeconds: 240,
        chimeType: 'singing-bowl',
        speakTitle: true,
        customAnnouncement: 'Rest your inner gaze effortlessly at the center between your eyebrows.'
      }
    ]
  },
  {
    id: 'prog-prana-shuddhi',
    title: 'Prana Shuddhi & Nadi Cleansing',
    sanskritTitle: 'प्राण शुद्धि एवं नाड़ी शोधन',
    subtitle: 'Full System Detox & Pranic Energy Purification',
    description: 'Systematic purification of the 72,000 energetic nadis. Clears metabolic toxins, releases dormant nervous stress, and balances solar and lunar rhythms.',
    category: 'vitality',
    categoryLabel: 'Prana & Vitality',
    badge: 'Tridosha Balance',
    accentColor: 'emerald',
    difficulty: 'Intermediate',
    bestTime: 'Morning before breakfast or Late Afternoon',
    chakra: 'Anahata & Manipura Chakras',
    mudra: 'Prana Mudra & Nasika Mudra',
    benefits: [
      'Purifies systemic blood oxygenation and metabolic energy',
      'Restores autonomic nervous balance (sympathetic vs parasympathetic)',
      'Improves lung capacity and vital diaphragmatic depth',
      'Induces profound mental serenity and clarity'
    ],
    precautions: [
      'Maintain slow, quiet breathing without forced sound except in Ujjayi',
      'Never strain or force breath holds'
    ],
    stages: [
      {
        id: 'ps-1-center',
        title: 'Sukhasana Centering Breath',
        durationSeconds: 120,
        chimeType: 'bell',
        speakTitle: true,
        customAnnouncement: 'Connect to your natural breath rhythm in Sukhasana.'
      },
      {
        id: 'ps-2-kapala',
        type: 'repeat',
        title: 'Kapalabhati Kriya (Toxin Expulsion)',
        durationSeconds: 45,
        chimeType: 'bell',
        speakTitle: true,
        repeatMode: 'count',
        repeatCount: 3,
        nestedStages: [
          { id: 'ps-kap-act', title: 'Active Exhalations', durationSeconds: 30, chimeType: 'bell', speakTitle: true },
          { id: 'ps-kap-pas', title: 'Deep Passive Inhale & Normal Breathing', durationSeconds: 15, chimeType: 'bell', speakTitle: true }
        ]
      },
      {
        id: 'ps-3-ujjayi',
        title: 'Ujjayi Pranayama (Ocean Breath)',
        durationSeconds: 300,
        chimeType: 'bell',
        speakTitle: true,
        customAnnouncement: 'Constrict the back of your throat gently. Listen to the ocean wave sound of your breath.'
      },
      {
        id: 'ps-4-nadi',
        type: 'repeat',
        title: 'Classical Nadi Shodhana (1:2 Ratio)',
        durationSeconds: 24,
        chimeType: 'bell',
        speakTitle: true,
        repeatMode: 'count',
        repeatCount: 6,
        nestedStages: [
          { id: 'ps-ns-inl', title: 'Inhale Left Nostril', durationSeconds: 4, chimeType: 'bell', speakTitle: true },
          { id: 'ps-ns-exr', title: 'Exhale Right Nostril', durationSeconds: 8, chimeType: 'bell', speakTitle: true },
          { id: 'ps-ns-inr', title: 'Inhale Right Nostril', durationSeconds: 4, chimeType: 'bell', speakTitle: true },
          { id: 'ps-ns-exl', title: 'Exhale Left Nostril', durationSeconds: 8, chimeType: 'bell', speakTitle: true }
        ]
      },
      {
        id: 'ps-5-visarjan',
        title: 'Prana Visarjana (Integration Rest)',
        durationSeconds: 240,
        chimeType: 'singing-bowl',
        speakTitle: true,
        customAnnouncement: 'Release all control of breath. Feel the free circulation of prana through every cell.'
      }
    ]
  },
  {
    id: 'prog-chandra-nidra',
    title: 'Chandra Shanti & Deep Nidra',
    sanskritTitle: 'चन्द्र शांति एवं योग निद्रा',
    subtitle: 'Nervous System Cooling, Stress Relief & Restorative Sleep',
    description: 'Designed specifically to trigger the mammalian dive reflex and activate parasympathetic tone. Calms rapid heart rate, cools somatic heat, and prepares the mind for deep dreamless sleep.',
    category: 'sleep',
    categoryLabel: 'Sleep & Serenity',
    badge: 'Parasympathetic Deep Tone',
    accentColor: 'blue',
    difficulty: 'All Levels',
    bestTime: 'Evening, Twilight, or Right Before Sleep',
    chakra: 'Soma & Anahata Chakras',
    mudra: 'Apana Mudra (Purification & Calming)',
    benefits: [
      'Lowers cortisol and adrenaline within minutes',
      'Cools core body temperature for deeper sleep onset',
      'Quiets racing thoughts, worry, and insomnia triggers',
      'Restores autonomic nervous recovery'
    ],
    precautions: [
      'Avoid bright screens after this practice',
      'Can be performed sitting in bed or lying in Shavasana'
    ],
    stages: [
      {
        id: 'cn-1-kayo',
        title: 'Kayotsarga (Somatic Body Scan)',
        durationSeconds: 180,
        chimeType: 'singing-bowl',
        speakTitle: true,
        customAnnouncement: 'Scan your body from toes to crown. Consciously soften every muscle.'
      },
      {
        id: 'cn-2-chandra',
        type: 'repeat',
        title: 'Chandra Bhedana (Left Nostril Cooling)',
        durationSeconds: 18,
        chimeType: 'bell',
        speakTitle: true,
        repeatMode: 'count',
        repeatCount: 6,
        nestedStages: [
          { id: 'cn-cb-inl', title: 'Inhale Left (Cooling Lunar Channel)', durationSeconds: 4, chimeType: 'bell', speakTitle: true },
          { id: 'cn-cb-hld', title: 'Gentle Comfort Hold', durationSeconds: 4, chimeType: 'bell', speakTitle: true },
          { id: 'cn-cb-exr', title: 'Smooth Exhale Right (Releasing Heat)', durationSeconds: 10, chimeType: 'bell', speakTitle: true }
        ]
      },
      {
        id: 'cn-3-bhramari',
        title: 'Low-Frequency Bhramari (Melatonin Release)',
        durationSeconds: 300,
        chimeType: 'bell',
        speakTitle: true,
        customAnnouncement: 'Gentle low-pitched humming exhale. Feel the vibration soothing your heart and chest.'
      },
      {
        id: 'cn-4-478',
        type: 'repeat',
        title: '4-7-8 Deep Vagal Reset Loop',
        durationSeconds: 19,
        chimeType: 'bell',
        speakTitle: true,
        repeatMode: 'count',
        repeatCount: 6,
        nestedStages: [
          { id: 'cn-478-in', title: 'Inhale Quietly through Nose', durationSeconds: 4, chimeType: 'bell', speakTitle: true },
          { id: 'cn-478-hld', title: 'Hold Breath Effortlessly', durationSeconds: 7, chimeType: 'bell', speakTitle: true },
          { id: 'cn-478-exh', title: 'Slow Complete Exhale through Mouth', durationSeconds: 8, chimeType: 'bell', speakTitle: true }
        ]
      },
      {
        id: 'cn-5-nidra',
        title: 'Yoga Nidra Stillness',
        durationSeconds: 360,
        chimeType: 'singing-bowl',
        speakTitle: true,
        customAnnouncement: 'Surrender into conscious rest. Drifting into effortless stillness.'
      }
    ]
  },
  {
    id: 'prog-surya-tejas',
    title: 'Surya Tejas & Jatharagni Sadhana',
    sanskritTitle: 'सूर्य तेजस एवं जाठराग्नि साधना',
    subtitle: 'Metabolic Heat, Digestion & Dynamic Vitality',
    description: 'A dynamic solar-channel practice that ignites internal digestive fire (Jatharagni), burns metabolic lethargy (Tamas), and floods the organism with invigorating prana.',
    category: 'vitality',
    categoryLabel: 'Prana & Vitality',
    badge: 'Solar Metabolic Fire',
    accentColor: 'rose',
    difficulty: 'Intermediate',
    bestTime: 'Early Morning, Sunrise (Empty Stomach)',
    chakra: 'Manipura Chakra (Solar Plexus)',
    mudra: 'Surya Mudra & Agni Mudra',
    benefits: [
      'Stimulates sluggish digestive enzyme production and peristalsis',
      'Transforms mental lethargy into decisive willpower',
      'Warms the physical system during cold seasons or morning stiffness',
      'Strengthens immunity and cellular metabolism'
    ],
    precautions: [
      'Avoid if suffering from severe acid reflux, ulcers, or high fever',
      'Do not practice late in the evening to avoid disrupting sleep'
    ],
    stages: [
      {
        id: 'st-1-deep',
        title: 'Dynamic Diaphragmatic Breath',
        durationSeconds: 120,
        chimeType: 'bell',
        speakTitle: true,
        customAnnouncement: 'Deep expansive belly breathing to awaken the diaphragm.'
      },
      {
        id: 'st-2-agnisar',
        type: 'repeat',
        title: 'Agnisar Dhauti Kriya (Igniting Fire)',
        durationSeconds: 22,
        chimeType: 'bell',
        speakTitle: true,
        repeatMode: 'count',
        repeatCount: 4,
        nestedStages: [
          { id: 'st-agn-exh', title: 'Complete Exhale & Empty Lungs', durationSeconds: 5, chimeType: 'bell', speakTitle: true },
          { id: 'st-agn-flap', title: 'Pump Abdomen in and out (30 Strokes)', durationSeconds: 12, chimeType: 'bell', speakTitle: true },
          { id: 'st-agn-in', title: 'Deep Inhale & Re-center', durationSeconds: 5, chimeType: 'bell', speakTitle: true }
        ]
      },
      {
        id: 'st-3-bhastrika',
        type: 'repeat',
        title: 'Surya Bhastrika (Solar Bellows)',
        durationSeconds: 35,
        chimeType: 'bell',
        speakTitle: true,
        repeatMode: 'count',
        repeatCount: 3,
        nestedStages: [
          { id: 'st-bhas-str', title: 'Forceful Inhale & Exhale Rhythm', durationSeconds: 20, chimeType: 'bell', speakTitle: true },
          { id: 'st-bhas-hld', title: 'Full Lung Expansion & Sun Visualization', durationSeconds: 15, chimeType: 'bell', speakTitle: true }
        ]
      },
      {
        id: 'st-4-suryabhed',
        type: 'repeat',
        title: 'Surya Bhedana (Right Nostril Heating)',
        durationSeconds: 20,
        chimeType: 'bell',
        speakTitle: true,
        repeatMode: 'count',
        repeatCount: 6,
        nestedStages: [
          { id: 'st-sb-inr', title: 'Inhale Right Nostril (Pingala Fire)', durationSeconds: 5, chimeType: 'bell', speakTitle: true },
          { id: 'st-sb-hld', title: 'Hold Breath with Root Lock', durationSeconds: 5, chimeType: 'bell', speakTitle: true },
          { id: 'st-sb-exl', title: 'Slow Exhale Left Nostril', durationSeconds: 10, chimeType: 'bell', speakTitle: true }
        ]
      },
      {
        id: 'st-5-dhyan',
        title: 'Surya Mandala Dhyanam (Golden Light)',
        durationSeconds: 240,
        chimeType: 'om',
        speakTitle: true,
        customAnnouncement: 'Visualize a brilliant rising sun radiating at the navel center, illuminating every cell.'
      }
    ]
  },
  {
    id: 'prog-quick-desk-reset',
    title: 'Prana Spandana: 10-Min Reset',
    sanskritTitle: 'त्वरित प्राण स्पन्दन',
    subtitle: 'De-Stress, Release Eye Strain & Restore Focus in 10 Minutes',
    description: 'A compact, potent reset sequence designed for busy days. Can be done right at your desk to alleviate screen fatigue, open the chest, and reset mental clarity without any equipment.',
    category: 'quick',
    categoryLabel: 'Quick Resets',
    badge: '10-Min Daily Reset',
    accentColor: 'amber',
    difficulty: 'Beginner',
    bestTime: 'Midday, Between Meetings, or Afternoon Slump',
    chakra: 'Anahata & Ajna',
    mudra: 'Chin Mudra',
    benefits: [
      'Dispels posture stiffness and thoracic restriction',
      'Calms sympathetic fight-or-flight triggers from high-pressure work',
      'Sharpens visual and mental focus in just 10 minutes'
    ],
    precautions: [
      'Sit tall with shoulders relaxed away from the ears'
    ],
    stages: [
      {
        id: 'qd-1-breath',
        title: 'Shoulder Roll & Rib Expansion Breath',
        durationSeconds: 120,
        chimeType: 'bell',
        speakTitle: true,
        customAnnouncement: 'Inhale shoulders up and back. Exhale releasing chest and neck tension.'
      },
      {
        id: 'qd-2-box',
        type: 'repeat',
        title: 'Tactical Box Breathing (Samavritti)',
        durationSeconds: 16,
        chimeType: 'bell',
        speakTitle: true,
        repeatMode: 'count',
        repeatCount: 5,
        nestedStages: [
          { id: 'qd-box-in', title: 'Inhale 4s', durationSeconds: 4, chimeType: 'bell', speakTitle: true },
          { id: 'qd-box-hld1', title: 'Hold 4s', durationSeconds: 4, chimeType: 'bell', speakTitle: true },
          { id: 'qd-box-exh', title: 'Exhale 4s', durationSeconds: 4, chimeType: 'bell', speakTitle: true },
          { id: 'qd-box-hld2', title: 'Hold 4s', durationSeconds: 4, chimeType: 'bell', speakTitle: true }
        ]
      },
      {
        id: 'qd-3-bhramari',
        title: 'Bhramari Humming & Palming',
        durationSeconds: 180,
        chimeType: 'bell',
        speakTitle: true,
        customAnnouncement: 'Rub palms warm, cup your eyes, and hum smoothly with each exhalation.'
      },
      {
        id: 'qd-4-stillness',
        title: 'Silent Centering Integration',
        durationSeconds: 120,
        chimeType: 'singing-bowl',
        speakTitle: true,
        customAnnouncement: 'Feel the clear, grounded calm return to your body and mind.'
      }
    ]
  }
];
