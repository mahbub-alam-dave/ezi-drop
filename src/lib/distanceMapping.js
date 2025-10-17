const baseDistances = {
  "ezi-drop-dhaka-01": {
    "ezi-drop-chattogram-01": 12,
    "ezi-drop-rajshahi-01": 10,
    "ezi-drop-khulna-01": 8,
    "ezi-drop-sylhet-01": 11,
    "ezi-drop-barishal-01": 9,
    "ezi-drop-rangpur-01": 10,
    "ezi-drop-mymensingh-01": 6,
  },
  "ezi-drop-chattogram-01": {
    "ezi-drop-dhaka-01": 12,
    "ezi-drop-barishal-01": 11,
    "ezi-drop-khulna-01": 13,
  },
  "ezi-drop-khulna-01": {
    "ezi-drop-dhaka-01": 8,
    "ezi-drop-rajshahi-01": 8,
    "ezi-drop-barishal-01": 6,
  },
  "ezi-drop-rajshahi-01": {
    "ezi-drop-dhaka-01": 10,
    "ezi-drop-khulna-01": 8,
    "ezi-drop-rangpur-01": 7,
  },
  "ezi-drop-sylhet-01": {
    "ezi-drop-dhaka-01": 11,
    "ezi-drop-chattogram-01": 9,
  },
  "ezi-drop-barishal-01": {
    "ezi-drop-dhaka-01": 9,
    "ezi-drop-khulna-01": 6,
  },
  "ezi-drop-rangpur-01": {
    "ezi-drop-rajshahi-01": 7,
    "ezi-drop-dhaka-01": 10,
  },
  "ezi-drop-mymensingh-01": {
    "ezi-drop-dhaka-01": 6,
  },
};

// 🧩 Flatten into a two-way distance map
export const distanceMap = Object.entries(baseDistances).reduce((map, [from, targets]) => {
  for (const [to, hours] of Object.entries(targets)) {
    map[`${from}-to-${to}`] = hours;
    map[`${to}-to-${from}`] = hours; // automatic reverse mapping ✅
  }
  return map;
}, { default: 12 });
