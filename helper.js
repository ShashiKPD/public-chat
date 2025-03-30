export const colors = ["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF", "#800000", "#808000", "#008000",
  "#800080", "#008080", "#000080", "#FF4500", "#2E8B57", "#4682B4", "#6A5ACD", "#20B2AA", "#8B0000",
  "#B8860B", "#556B2F", "#7B68EE", "#8B008B", "#483D8B", "#2F4F4F", "#708090", "#FA8072", "#D2691E",
  "#FF6347", "#FF7F50", "#FFD700", "#ADFF2F", "#7FFF00", "#32CD32", "#66CDAA", "#00CED1", "#40E0D0",
  "#5F9EA0", "#1E90FF", "#4169E1", "#6495ED", "#8A2BE2", "#4B0082", "#9400D3", "#FF1493", "#FF69B4",
  "#DB7093", "#FFB6C1", "#FFA07A", "#CD5C5C", "#BC8F8F", "#D2B48C", "#F4A460", "#B22222", "#FF8C00",
  "#DA70D6", "#9932CC", "#BA55D3", "#FF00FF", "#8B4513", "#D3D3D3", "#A52A2A", "#696969", "#C71585",
  "#E9967A", "#FF4500", "#EE82EE", "#3CB371", "#6B8E23", "#BC8F8F", "#4682B4", "#228B22", "#5F9EA0",
  "#800080", "#B0E0E6", "#C0C0C0", "#DDA0DD", "#98FB98", "#FF6347", "#FA8072", "#FF7F50", "#DC143C",
  "#FF69B4", "#DB7093", "#8B0000", "#B22222", "#A9A9A9", "#32CD32", "#8A2BE2", "#FF8C00", "#FFD700",
  "#808000", "#556B2F", "#7B68EE", "#6A5ACD", "#7CFC00", "#4682B4", "#87CEEB", "#6B8E23", "#D8BFD8"]
  
const adjectives = [
    'Brave', 'Swift', 'Clever', 'Mighty', 'Fierce', 'Bold', 'Loyal', 'Witty', 'Noble', 'Jolly',
    'Fearless', 'Gallant', 'Daring', 'Heroic', 'Gentle', 'Vigilant', 'Stalwart', 'Cunning', 'Majestic', 'Radiant'
];

const nouns = [
    'Tiger', 'Eagle', 'Panther', 'Wolf', 'Hawk', 'Lion', 'Falcon', 'Bear', 'Fox', 'Otter',
    'Leopard', 'Jaguar', 'Cobra', 'Shark', 'Raven', 'Buffalo', 'Stallion', 'Viper', 'Puma', 'Orca'
];

const generatedNames = new Set(); // Stores all unique names

export function generateUniqueName() {
    let uniqueName;

    do {
        const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
        const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];

        uniqueName = `${randomAdjective} ${randomNoun}`;
    } while (generatedNames.has(uniqueName)); // Regenerate if the name is already taken

    generatedNames.add(uniqueName); // Store the new unique name
    return uniqueName;
}
