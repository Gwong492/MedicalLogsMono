const data = {
    user: "test_user",
    headacheLog: [
    { 
        date: "2024-16-01", 
        intensity: 5, 
        symptom: ['nausea', 'dizziness'], 
        triggers: ['stress', 'lack_of_sleep'], 
        medicationTaken: ["ibuprophen"], 
        reliefRequired: ["laying down", "missed work"], 
        notes: "Severe headache lasting several hours." 
    },
    {
        date: "2024-16-01",
        intensity: 5,
        symptom: ["nausea", "dizziness"],
        triggers: ["stress", "lack_of_sleep"],
        medicationTaken: ["ibuprophen"],
        reliefRequired: ["laying down", "missed work"],
        notes: "Severe headache lasting several hours."
  },
  {
        date: "2024-18-01",
        intensity: 3,
        symptom: ["light_sensitivity"],
        triggers: ["screen_time"],
        medicationTaken: ["acetaminophen"],
        reliefRequired: ["rest"],
        notes: "Mild headache improved after resting."
  },
  {
        date: "2024-20-01",
        intensity: 7,
        symptom: ["throbbing_pain", "blurred_vision"],
        triggers: ["dehydration", "stress"],
        medicationTaken: ["sumatriptan"],
        reliefRequired: ["dark_room", "missed work"],
        notes: "Migraine with visual disturbance; relief after medication."
  },
  {
        date: "2024-22-01",
        intensity: 2,
        symptom: ["neck_stiffness"],
        triggers: ["poor_posture"],
        medicationTaken: [],
        reliefRequired: ["stretching"],
        notes: "Tension headache resolved with stretching."
  },
  {
        date: "2024-24-01",
        intensity: 6,
        symptom: ["nausea", "sound_sensitivity"],
        triggers: ["loud_noise", "fatigue"],
        medicationTaken: ["ibuprophen"],
        reliefRequired: ["rest", "dark_room"],
        notes: "Moderate migraine, improved after rest."
  },
  { 
        date: "2024-16-01", 
        intensity: 5, 
        symptom: ['nausea', 'dizziness'], 
        triggers: ['stress', 'lack_of_sleep'], 
        medicationTaken: ["ibuprophen"], 
        reliefRequired: ["laying down", "missed work"], 
        notes: "Severe headache lasting several hours." 
    },
    {
        date: "2024-16-01",
        intensity: 5,
        symptom: ["nausea", "dizziness"],
        triggers: ["stress", "lack_of_sleep"],
        medicationTaken: ["ibuprophen"],
        reliefRequired: ["laying down", "missed work"],
        notes: "Severe headache lasting several hours."
  },
  {
        date: "2024-18-01",
        intensity: 3,
        symptom: ["light_sensitivity"],
        triggers: ["screen_time"],
        medicationTaken: ["acetaminophen"],
        reliefRequired: ["rest"],
        notes: "Mild headache improved after resting."
  },
  {
        date: "2024-20-01",
        intensity: 7,
        symptom: ["throbbing_pain", "blurred_vision"],
        triggers: ["dehydration", "stress"],
        medicationTaken: ["sumatriptan"],
        reliefRequired: ["dark_room", "missed work"],
        notes: "Migraine with visual disturbance; relief after medication."
  },
  {
        date: "2024-22-01",
        intensity: 2,
        symptom: ["neck_stiffness"],
        triggers: ["poor_posture"],
        medicationTaken: [],
        reliefRequired: ["stretching"],
        notes: "Tension headache resolved with stretching."
  },
  {
        date: "2024-24-01",
        intensity: 6,
        symptom: ["nausea", "sound_sensitivity"],
        triggers: ["loud_noise", "fatigue"],
        medicationTaken: ["ibuprophen"],
        reliefRequired: ["rest", "dark_room"],
        notes: "Moderate migraine, improved after rest."
  },
  { 
        date: "2024-16-01", 
        intensity: 5, 
        symptom: ['nausea', 'dizziness'], 
        triggers: ['stress', 'lack_of_sleep'], 
        medicationTaken: ["ibuprophen"], 
        reliefRequired: ["laying down", "missed work"], 
        notes: "Severe headache lasting several hours." 
    },
    {
        date: "2024-16-01",
        intensity: 5,
        symptom: ["nausea", "dizziness"],
        triggers: ["stress", "lack_of_sleep"],
        medicationTaken: ["ibuprophen"],
        reliefRequired: ["laying down", "missed work"],
        notes: "Severe headache lasting several hours."
  },
  {
        date: "2024-18-01",
        intensity: 3,
        symptom: ["light_sensitivity"],
        triggers: ["screen_time"],
        medicationTaken: ["acetaminophen"],
        reliefRequired: ["rest"],
        notes: "Mild headache improved after resting."
  },
  {
        date: "2024-20-01",
        intensity: 7,
        symptom: ["throbbing_pain", "blurred_vision"],
        triggers: ["dehydration", "stress"],
        medicationTaken: ["sumatriptan"],
        reliefRequired: ["dark_room", "missed work"],
        notes: "Migraine with visual disturbance; relief after medication."
  },
  {
        date: "2024-22-01",
        intensity: 2,
        symptom: ["neck_stiffness"],
        triggers: ["poor_posture"],
        medicationTaken: [],
        reliefRequired: ["stretching"],
        notes: "Tension headache resolved with stretching."
  },
  {
        date: "2024-24-01",
        intensity: 6,
        symptom: ["nausea", "sound_sensitivity"],
        triggers: ["loud_noise", "fatigue"],
        medicationTaken: ["ibuprophen"],
        reliefRequired: ["rest", "dark_room"],
        notes: "Moderate migraine, improved after rest."
  },
  { 
        date: "2024-16-01", 
        intensity: 5, 
        symptom: ['nausea', 'dizziness'], 
        triggers: ['stress', 'lack_of_sleep'], 
        medicationTaken: ["ibuprophen"], 
        reliefRequired: ["laying down", "missed work"], 
        notes: "Severe headache lasting several hours." 
    },
    {
        date: "2024-16-01",
        intensity: 5,
        symptom: ["nausea", "dizziness"],
        triggers: ["stress", "lack_of_sleep"],
        medicationTaken: ["ibuprophen"],
        reliefRequired: ["laying down", "missed work"],
        notes: "Severe headache lasting several hours."
  },
  {
        date: "2024-18-01",
        intensity: 3,
        symptom: ["light_sensitivity"],
        triggers: ["screen_time"],
        medicationTaken: ["acetaminophen"],
        reliefRequired: ["rest"],
        notes: "Mild headache improved after resting."
  },
  {
        date: "2024-20-01",
        intensity: 7,
        symptom: ["throbbing_pain", "blurred_vision"],
        triggers: ["dehydration", "stress"],
        medicationTaken: ["sumatriptan"],
        reliefRequired: ["dark_room", "missed work"],
        notes: "Migraine with visual disturbance; relief after medication."
  },
  {
        date: "2024-22-01",
        intensity: 2,
        symptom: ["neck_stiffness"],
        triggers: ["poor_posture"],
        medicationTaken: [],
        reliefRequired: ["stretching"],
        notes: "Tension headache resolved with stretching."
  },
  {
        date: "2024-24-01",
        intensity: 6,
        symptom: ["nausea", "sound_sensitivity"],
        triggers: ["loud_noise", "fatigue"],
        medicationTaken: ["ibuprophen"],
        reliefRequired: ["rest", "dark_room"],
        notes: "Moderate migraine, improved after rest."
  },
  { 
        date: "2024-16-01", 
        intensity: 5, 
        symptom: ['nausea', 'dizziness'], 
        triggers: ['stress', 'lack_of_sleep'], 
        medicationTaken: ["ibuprophen"], 
        reliefRequired: ["laying down", "missed work"], 
        notes: "Severe headache lasting several hours." 
    },
    {
        date: "2024-16-01",
        intensity: 5,
        symptom: ["nausea", "dizziness"],
        triggers: ["stress", "lack_of_sleep"],
        medicationTaken: ["ibuprophen"],
        reliefRequired: ["laying down", "missed work"],
        notes: "Severe headache lasting several hours."
  },
  {
        date: "2024-18-01",
        intensity: 3,
        symptom: ["light_sensitivity"],
        triggers: ["screen_time"],
        medicationTaken: ["acetaminophen"],
        reliefRequired: ["rest"],
        notes: "Mild headache improved after resting."
  },
  {
        date: "2024-20-01",
        intensity: 7,
        symptom: ["throbbing_pain", "blurred_vision"],
        triggers: ["dehydration", "stress"],
        medicationTaken: ["sumatriptan"],
        reliefRequired: ["dark_room", "missed work"],
        notes: "Migraine with visual disturbance; relief after medication."
  },
  {
        date: "2024-22-01",
        intensity: 2,
        symptom: ["neck_stiffness"],
        triggers: ["poor_posture"],
        medicationTaken: [],
        reliefRequired: ["stretching"],
        notes: "Tension headache resolved with stretching."
  },
  {
        date: "2024-24-01",
        intensity: 6,
        symptom: ["nausea", "sound_sensitivity"],
        triggers: ["loud_noise", "fatigue"],
        medicationTaken: ["ibuprophen"],
        reliefRequired: ["rest", "dark_room"],
        notes: "Moderate migraine, improved after rest."
  },
  { 
        date: "2024-16-01", 
        intensity: 5, 
        symptom: ['nausea', 'dizziness'], 
        triggers: ['stress', 'lack_of_sleep'], 
        medicationTaken: ["ibuprophen"], 
        reliefRequired: ["laying down", "missed work"], 
        notes: "Severe headache lasting several hours." 
    },
    {
        date: "2024-16-01",
        intensity: 5,
        symptom: ["nausea", "dizziness"],
        triggers: ["stress", "lack_of_sleep"],
        medicationTaken: ["ibuprophen"],
        reliefRequired: ["laying down", "missed work"],
        notes: "Severe headache lasting several hours."
  },
  {
        date: "2024-18-01",
        intensity: 3,
        symptom: ["light_sensitivity"],
        triggers: ["screen_time"],
        medicationTaken: ["acetaminophen"],
        reliefRequired: ["rest"],
        notes: "Mild headache improved after resting."
  },
  {
        date: "2024-20-01",
        intensity: 7,
        symptom: ["throbbing_pain", "blurred_vision"],
        triggers: ["dehydration", "stress"],
        medicationTaken: ["sumatriptan"],
        reliefRequired: ["dark_room", "missed work"],
        notes: "Migraine with visual disturbance; relief after medication."
  },
  {
        date: "2024-22-01",
        intensity: 2,
        symptom: ["neck_stiffness"],
        triggers: ["poor_posture"],
        medicationTaken: [],
        reliefRequired: ["stretching"],
        notes: "Tension headache resolved with stretching."
  },
  {
        date: "2024-24-01",
        intensity: 6,
        symptom: ["nausea", "sound_sensitivity"],
        triggers: ["loud_noise", "fatigue"],
        medicationTaken: ["ibuprophen"],
        reliefRequired: ["rest", "dark_room"],
        notes: "Moderate migraine, improved after rest."
  },
  { 
        date: "2024-16-01", 
        intensity: 5, 
        symptom: ['nausea', 'dizziness'], 
        triggers: ['stress', 'lack_of_sleep'], 
        medicationTaken: ["ibuprophen"], 
        reliefRequired: ["laying down", "missed work"], 
        notes: "Severe headache lasting several hours." 
    },
    {
        date: "2024-16-01",
        intensity: 5,
        symptom: ["nausea", "dizziness"],
        triggers: ["stress", "lack_of_sleep"],
        medicationTaken: ["ibuprophen"],
        reliefRequired: ["laying down", "missed work"],
        notes: "Severe headache lasting several hours."
  },
  {
        date: "2024-18-01",
        intensity: 3,
        symptom: ["light_sensitivity"],
        triggers: ["screen_time"],
        medicationTaken: ["acetaminophen"],
        reliefRequired: ["rest"],
        notes: "Mild headache improved after resting."
  },
  {
        date: "2024-20-01",
        intensity: 7,
        symptom: ["throbbing_pain", "blurred_vision"],
        triggers: ["dehydration", "stress"],
        medicationTaken: ["sumatriptan"],
        reliefRequired: ["dark_room", "missed work"],
        notes: "Migraine with visual disturbance; relief after medication."
  },
  {
        date: "2024-22-01",
        intensity: 2,
        symptom: ["neck_stiffness"],
        triggers: ["poor_posture"],
        medicationTaken: [],
        reliefRequired: ["stretching"],
        notes: "Tension headache resolved with stretching."
  },
  {
        date: "2024-24-01",
        intensity: 6,
        symptom: ["nausea", "sound_sensitivity"],
        triggers: ["loud_noise", "fatigue"],
        medicationTaken: ["ibuprophen"],
        reliefRequired: ["rest", "dark_room"],
        notes: "Moderate migraine, improved after rest."
  },
  ]
};

module.exports = data;