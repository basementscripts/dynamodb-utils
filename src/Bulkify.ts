import { chunk as chunker } from 'lodash'

export default class Bulkify {
	private records: any
	private size: number

	constructor(size = 25) {
		this.records = []
		this.size = size
	}

	get query() {
		return this.records.length > 0 ? chunker(this.records, this.size).map(this.buildRequest) : []
	}

	buildRequest(records) {
		return {
			RequestItems: {
				...records.reduce((collection, item) => {
					if (!collection[item.index]) {
						collection[item.index] = []
					}
					collection[item.index].push(item.record)
					return collection
				}, {})
			}
		}
	}

	add(index, data) {
		if (Array.isArray(data)) {
			this.records.push(
				...data.map((x) => ({
					index,
					record: this.bulkWrapItem(x)
				}))
			)
		} else {
			this.records.push({
				index,
				record: this.bulkWrapItem(data)
			})
		}
	}

	bulkWrapItem(Item) {
		return {
			PutRequest: {
				Item
			}
		}
	}
}
