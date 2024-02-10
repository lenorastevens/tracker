import ListItem from "./ListItem";

// create a list interfce
interface List {
    list: ListItem[],
    load(): void,
    save(): void,
    clearList(): void,
    addItem(itemObj: ListItem): void,
    removeItem(id: string): void,
}

// create the FullList class that uses the interface
export default class FullList implements List {

    static instance: FullList = new FullList()

    private constructor(private _list: ListItem[] = []) {}

    get list(): ListItem[] {
        return this._list
    }

    // load method of FullList
    load(): void {
        const storedList: string | null = localStorage.getItem("myList")
        if (typeof storedList !== "string") return

        const parsedList: { _id: string, _item: string, _checked: boolean } [] = JSON.parse(storedList)

        parsedList.forEach(itemObj => {
            const newListItem = new ListItem(itemObj._id, itemObj._item, itemObj._checked)

            FullList.instance.addItem(newListItem)
        })
    }

    // save method of FullList
    save(): void {
        localStorage.setItem("myList", JSON.stringify(this._list))
    }

    // clear method of FullList
    clearList(): void {
        this._list = []
        this.save()
    }

    // add item to FullList
    addItem(itemObj: ListItem): void {
        this._list.push(itemObj)
        this.save()
    }

    // remove an item from FullList
    removeItem(id: string): void {
        this._list = this._list.filter(item => item.id !== id)
        this.save()
    }
}