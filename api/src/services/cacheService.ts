import * as dateMath from 'date-arithmetic';

const CAPACITY = 1000;
const DEFAULT_EXPIRES = 300;

// LRU Cache by type
// keeps the last 1000 results for 5 mins(default) per entry
export class CacheService {
	private static values: {
		[type: string]: Map<string, { expires: Date; value: any }>;
	} = {};

	private constructor() {
		// static class
	}

	static set<T>(type: string, key: string, value: T) {
		if (!this.values[type]) {
			this.values[type] = new Map();
		}

		const current = this.values[type];

		if (current.has(key)) {
			current.delete(key);
		} else {
			// delete oldest if at capacity
			if (current.size === CAPACITY) {
				current.delete(Array.from(current.keys())[0]);
			}
		}
		current.set(key, {
			expires: dateMath.add(new Date(), DEFAULT_EXPIRES, 'seconds'),
			value,
		});
	}

	static get<T>(type: string, key: string): T {
		if (this.values[type]) {
			const current = this.values[type];
			const found = current.get(key);
			if (found) {
				current.delete(key);

				// return value if not expired
				if (new Date() < found.expires) {
					// move to top of map
					current.set(key, found);

					// return value
					return found.value;
				}
			}
		}

		return null;
	}
}
