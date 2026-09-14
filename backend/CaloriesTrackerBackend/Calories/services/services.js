export class CaloriesService {
    static calculateNutrient(data, amount, key) {
        return ((data[key] ?? 0) * amount) / 100;
    }
    static calculateCalories = (data, amount) => this.calculateNutrient(data, amount, 'calories');
    static calculateProtein = (data, amount) => this.calculateNutrient(data, amount, 'protein');
    static calculateCarbs = (data, amount) => this.calculateNutrient(data, amount, 'carbs');
    static calculateFats = (data, amount) => this.calculateNutrient(data, amount, 'fat');
    static calculateItemNutrition(data, amount) {
        return {
            calories: this.calculateCalories(data, amount),
            protein: this.calculateProtein(data, amount),
            carbs: this.calculateCarbs(data, amount),
            fat: this.calculateFats(data, amount),
        };
    }
    static calculateTotalNutrition(items) {
        return items.reduce((acc, item) => ({
            calories: acc.calories + item.calories,
            protein: acc.protein + item.protein,
            carbs: acc.carbs + item.carbs,
            fat: acc.fat + item.fat,
        }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
    }
}
//# sourceMappingURL=services.js.map