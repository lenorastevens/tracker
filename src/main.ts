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

    // get new entry form
    const itemEntryForm = document.getElementById("itemEntryForm") as HTMLFormElement

    // listener for a submit
    itemEntryForm.addEventListener("submit", (event: SubmitEvent): void => {
        event.preventDefault()

        // get the add entry input element value
        const input = document.getElementById("newItem") as HTMLInputElement
        const newEntryText: string = input.value.trim()
        if(!newEntryText.length) return

        // assign item a number for tracking
        const itemId: number = fullList.list.length
            ? parseInt(fullList.list[fullList.list.length-1].id) + 1
            : 1

        // put item details together
        const newItem = new ListItem(itemId.toString(), newEntryText)
        
        // add itme to liast
        fullList.addItem(newItem)

        // render the list details
        template.render(fullList)

        // clear input box for next entry
        input.value = '';
    })

    // get clear button element
    const clearItems = document.getElementById("clearItemsButton") as HTMLButtonElement

    // listen for clear button to get pushed
    clearItems.addEventListener("click", (): void => {
        fullList.clearList()
        template.clear()
    })

    // load and render lists
    fullList.load()
    template.render(fullList)


}

// listens for load event and start the init methods
document.addEventListener("DOMContentLoaded", initApp)