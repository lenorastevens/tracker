import './css/style.css'
import './css/style.css'
import FullList from './model/FullList'
import ListItem from './model/ListItem'
import ListTemplate from './templates/ListTemplate'

const initApp = (): void => {
    const fullList = FullList.instance
    const template = ListTemplate.instance

    // Function to fetch quotes from the provided URL
    const fetchQuotes = async (): Promise<any[]> => {
        try {
            const response = await fetch('https://type.fit/api/quotes')
            const data = await response.json()
            return data
        } catch (error) {
            console.error('Error fetching quotes:', error)
            return []
        }
    }

    // Function to display a random quote
    const displayRandomQuote = async () => {
        const quotes = await fetchQuotes()
        if (quotes.length > 0) {
            const randomIndex = Math.floor(Math.random() * quotes.length)
            const { text, author } = quotes[randomIndex]
            // Remove ", type.fit" from the author string
            const cleanedAuthor = author.replace(/[-,]? ?type\.fit/g, '').trim();
            const quoteElement = document.getElementById("quote")
            if (quoteElement) {
                quoteElement.innerHTML = `<blockquote>${text}</blockquote><p>- ${cleanedAuthor}</p>`
            }
        }
    }

    // Display a random quote initially
    displayRandomQuote()

    // Update quote every 5 minutes
    setInterval(displayRandomQuote, 5 * 60 * 1000)

    const itemEntryForm = document.getElementById("itemEntryForm") as HTMLFormElement

    itemEntryForm.addEventListener("submit", (event: SubmitEvent): void => {
        event.preventDefault()

        const input = document.getElementById("newItem") as HTMLInputElement
        const newEntryText: string = input.value.trim()
        if(!newEntryText.length) return

        const itemId: number = fullList.list.length
            ? parseInt(fullList.list[fullList.list.length-1].id) + 1
            : 1

        const newItem = new ListItem(itemId.toString(), newEntryText)
        
        fullList.addItem(newItem)

        template.render(fullList)

        input.value = '';
    })

    const clearItems = document.getElementById("clearItemsButton") as HTMLButtonElement

    clearItems.addEventListener("click", (): void => {
        fullList.clearList()
        template.clear()
    })

    fullList.load()
    template.render(fullList)


}

document.addEventListener("DOMContentLoaded", initApp)