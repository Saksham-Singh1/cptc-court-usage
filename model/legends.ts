export class Legends {
    private map: Map<string, string>;

    constructor() {
        this.map = new Map<string, string>();

        // Initialize entries
        this.add('#c8e96c', 'Reserved');
        this.add('#f6c665', 'Social');
        this.add('#f2f680', 'Teaching Court'); 
        this.add('#90ee90', 'Walk On');
        this.add('#ff75b1', 'Adult Program');
        this.add('#fc6767', 'Junior Program');
        this.add('#66c8ec', 'Tournament');
        this.add('#ffc0cb', 'USTA');
        this.add('#e6e2bf', 'Available');
        this.add('#eeeaca', 'Available');        
        this.add('#d5d5d5', 'Unavailable'); 
        this.add('#647c8a', 'Closed'); 
    }

    // Method to add entries to the dictionary
    add(key: string, value: string): void {
        this.map.set(key.toLowerCase(), value);
    }

    get(key: string): string {
        const value = this.map.get(key.toLowerCase());
        return value !== undefined ? value : key;
    }

    // Method to list all entries
    entries(): [string, string][] {
        return Array.from(this.map.entries());
    }
}