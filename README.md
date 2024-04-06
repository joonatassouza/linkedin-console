## LinkedIn Automation Tool

This tool provides a set of functionalities to automate certain actions on LinkedIn. You can inject a new section with input fields and some buttons, and perform actions such as sending messages, creating new posts, saving text to localStorage, and refreshing the page.

### How to Use

1. **Copy and Paste the Code to Chrome Console**:

   - Open Chrome Browser.
   - Press `Ctrl + Shift + J` (Windows/Linux) or `Cmd + Option + J` (Mac) to open the Developer Console.
   - Copy the entire code from linkedin.js and paste it into the console.
   - Press `Enter` to execute the code.

2. **Using the Functionalities**:

   - After executing the code, you'll notice a new section added to your LinkedIn page with input fields and buttons.
   - You can type your message or text in the input field provided.
   - There are several buttons available:
     - **Send**: Sends the typed message to the appropriate input field on the LinkedIn page.
     - **Clear**: Clears the input field.
     - **Save**: Saves the text from the input field to the browser's localStorage.
     - **Refresh**: Refreshes the current page (Note: This functionality is specific to Chrome extensions and may not work in all contexts).
   - Depending on the context, the tool will automatically detect whether to send messages to comments or create new posts.

3. **Removing Listeners and Disconnecting Observer**:
   - The tool automatically removes listeners and disconnects the observer when you close the page or navigate away from it to prevent memory leaks.

### Note

- This tool is intended for educational purposes only.
- Some functionalities, such as refreshing the page, may not work outside the context of a Chrome extension due to browser security restrictions.
- I added some variables as configuration to make it easy to change the selectors if needed after some linkedin updates.
