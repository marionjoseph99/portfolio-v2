// IMPORTANT: Firebase is removed from this version as your provided working code
        // uses direct Gemini API calls without Firebase for chat history or authentication.
        // If you need chat history persistence, Firebase integration would need to be re-added.

        // Define global variables for Canvas environment (for local testing, these will be undefined)
        const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
        // The firebaseConfig and initialAuthToken are no longer used since Firebase is removed.
        // Keeping them commented out for clarity, but they don't affect the current logic.
        /*
        const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {
            apiKey: "YOUR_FIREBASE_API_KEY", 
            authDomain: "YOUR_FIREBASE_AUTH_DOMAIN",
            projectId: "YOUR_FIREBASE_PROJECT_ID",
            storageBucket: "YOUR_FIREBASE_STORAGE_BUCKET",
            messagingSenderId: "YOUR_FIREBASE_MESSAGING_SENDER_ID",
            appId: "YOUR_FIREBASE_APP_ID"
        };
        const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null; 
        */

        // DOM Elements
        const chatbotWidget = document.getElementById('marjo-chatbot-widget');
        const chatbotHeader = document.getElementById('marjo-chatbot-header');
        const sparkleEmoji = chatbotHeader.querySelector('.marjo-sparkle-emoji'); 
        const closeChatButton = document.getElementById('marjo-close-chat');
        const messagesArea = document.getElementById('marjo-messages-area');
        const chatInput = document.getElementById('marjo-chat-input');
        const sendButton = document.getElementById('marjo-send-button');
        const initialMessageDiv = document.getElementById('marjo-initial-message');
        const popupMessage = document.getElementById('marjo-popup-message'); 
        const closePopupButton = document.getElementById('marjo-close-popup-button'); 

        // State variables
        let isLoading = false;
        // messages array is now only for UI display, not for API chat history context
        let messages = []; 

        // Information about Marjo to be used by the AI
        const marjoInfo = `
            Name: Marjo Paguia
            Age: 27
            Gender: Male
            Birthday: June 06, 1998
            Birth place: Sierra Bullones, Bohol
            Location: General Trias, Cavite, Philippines
            Timezone: GMT+8
            Contact:
              Email: noroniomarjo@gmail.com
              Phone: +639917484985
              Website: www.marjo.site
            Current Role: Computer-aided Design Drafter
            Program: Bachelot of Science in Architecture
            School: National University PH – Calamba, Laguna Campus
            Education:
              - College: National University PH – Calamba, Laguna Campus, BS Architecture (2019–2025)
              - Senior High & Junior High: Mandaluyong City High School (2013–2019)
              - Elementary: Felimon P. Javier Elementary School (2006–2013)
            Summary: Aspiring architect and visual artist with a strong foundation in design, rendering, and creative visualization. Specializes in architectural renderings, spatial planning, and digital illustrations using tools like Revit, AutoCAD, SketchUp, Blender, and Adobe Creative Suite. Passionate about combining technical precision with artistry to create inspiring, functional spaces.
            Skills: Autodesk AutoCAD, Autodesk Revit, SketchUp Pro, D5 Render, Lumion, Adobe Photoshop, Adobe Illustrator, Adobe Premiere Pro
            Tools: AutoCAD, Revit, SketchUp, Blender, Photoshop, Illustrator, Premiere Pro, D5 Render, Lumion
            Work Experience:
              - Solar Proposal Designer at Beehive BPO (San Pedro, Laguna, 2023–2024)
              - Freelance Architectural Student under the brand M.Studio (General Trias, Cavite, 2019–present)
            Awards:
              - Grand Prize – National Anthem Music Video Making Contest (Mandaluyong High School)
              - Gov. Neptali Gonzales Awardee (Mandaluyong High School)
              - Academic Excellence Award – With Honors (Mandaluyung High School)
              - Specific Discipline Award – Technical Drafting (Mandaluyong High School)
              - Top Three – Architectural Design 6 Top Performer (EARIST)
              - Grand Prize – Institutional T-shirt Design Competition (EARIST)
            Services:
              - 3D Modelling: Crafting high-quality 3D models for architecture, product visualization, and creative projects.
              - Rendering: Producing photorealistic renderings for architectural and interior design.
              - Manual Drawings: Hand-drawn architectural and artistic sketches with detail and authenticity.
              - Presentation Board Layout: Clean, professional boards for architectural design presentations.
              - Upcoming Services: New creative and professional services in development—stay tuned!
            Personality:
              Traits: Visual artist, Detail-oriented, Creative and technical thinker, Emotionally aware, Professional and respectful communicator
              Communication Style: Professional but conversational; prefers clear, direct language without jargon or corporate buzzwords.
            Goals: Build a long-term career in architectural design and drafting, eventually run an architectural firm, and continue blending art and architecture to create meaningful designs.
            Social Media Accounts:
              - Facebook: [M.Studio Facebook](https://www.facebook.com/people/MStudio/100093286052861/)
              - Instagram: [Marjo's Instagram](https://www.instagram.com/13_1_18_jo/?next=%2F)
              - LinkedIn: [Marjo Paguia on LinkedIn](https://www.linkedin.com/in/marjo-paguia-6b5839144/)
              - Behance: [Marjo Paguia on Behance](https://www.behance.net/marjopaguia)
              - Tiktok: [M.Studio Tiktok](https://www.tiktok.com/@m.studio24?is_from_webapp=1&sender_device=pc)
            Availability for commission:
              - anytime Every Saturday and Sunday 
            Freelance/ Commission prices
              - send me a message for quotation
        `;

        // --- Utility Functions ---

        // Function to scroll to the bottom of the messages area
        const scrollToBottom = () => {
            messagesArea.scrollTop = messagesArea.scrollHeight;
        };

        // Function to process message content: extract buttons (Markdown links) and return remaining text
        function processMessageContent(text) {
            const linkRegex = /\[(.*?)\]\((https?:\/\/[^\s]+?)\)/g;
            let plainText = text;
            const buttons = [];
            let match;

            // Collect all button data and remove markdown links from the text
            while ((match = linkRegex.exec(text)) !== null) { // Use original text for matching
                buttons.push({ text: match[1], url: match[2] });
            }
            // Reset regex lastIndex to 0 after exec loop for subsequent calls
            linkRegex.lastIndex = 0; 
            // Remove markdown links from the text for the typewriter effect
            plainText = plainText.replace(linkRegex, ''); // Use plainText here

            return { plainText, buttons };
        }

        // Function to simulate typing out a message
        const typeMessage = (element, fullText, delay = 40) => { 
            // Find and remove the typing animation container if it exists
            const typingAnimationContainer = element.querySelector('.marjo-ai-typing-animation-container');
            if (typingAnimationContainer) {
                typingAnimationContainer.remove();
            }

            let i = 0;
            // Ensure the element is empty before starting to type
            element.textContent = ''; 
            return new Promise(resolve => {
                const interval = setInterval(() => {
                    if (i < fullText.length) {
                        element.textContent += fullText.charAt(i);
                        i++;
                        scrollToBottom(); // Keep scrolling as text appears
                    } else {
                        clearInterval(interval);
                        resolve(); // Resolve the promise when typing is complete
                    }
                }, delay);
            });
        };

        // Function to add a message to the UI
        // This function now accepts an optional targetBubbleElement to update an existing bubble
        const addMessageToUI = async (sender, rawText, isTyping = false, targetBubbleElement = null) => {
            if (initialMessageDiv) {
                initialMessageDiv.style.display = 'none'; // Hide "Type a message..."
            }

            let bubbleDiv;
            if (targetBubbleElement) {
                // If an existing bubble is provided, use it
                bubbleDiv = targetBubbleElement;
                // Clear its content first if it had animation
                const typingAnimationContainer = bubbleDiv.querySelector('.marjo-ai-typing-animation-container');
                if (typingAnimationContainer) {
                    typingAnimationContainer.remove();
                }
                bubbleDiv.textContent = ''; // Clear any previous text/dots
            } else {
                // Otherwise, create a new message and bubble
                const messageDiv = document.createElement('div');
                messageDiv.className = `flex ${sender === 'user' ? 'justify-end' : 'justify-start'}`;

                bubbleDiv = document.createElement('div');
                bubbleDiv.className = `marjo-message-bubble ${sender === 'user' ? 'marjo-user-bubble' : 'marjo-ai-bubble'}`;
                
                messageDiv.appendChild(bubbleDiv);
                messagesArea.appendChild(messageDiv);
            }
            
            scrollToBottom();

            if (isTyping) {
                // Add the bouncing balls animation
                const typingAnimationContainer = document.createElement('div');
                typingAnimationContainer.className = 'marjo-ai-typing-animation-container';
                for (let i = 0; i < 3; i++) {
                    const ball = document.createElement('div');
                    ball.className = 'marjo-ball bounce';
                    typingAnimationContainer.appendChild(ball);
                }
                bubbleDiv.appendChild(typingAnimationContainer);
                scrollToBottom(); // Scroll again to ensure animation is visible
            } else if (sender === 'gemini') {
                const { plainText, buttons } = processMessageContent(rawText);
                await typeMessage(bubbleDiv, plainText); // Type out the plain text

                // Add buttons after typing is complete
                if (buttons.length > 0) {
                    const buttonsContainer = document.createElement('div');
                    buttonsContainer.classList.add('marjo-chat-buttons-container');
                    buttons.forEach(buttonData => {
                        const button = document.createElement('button');
                        button.classList.add('marjo-chat-button');
                        button.textContent = buttonData.text;
                        button.onclick = () => window.open(buttonData.url, '_blank');
                        buttonsContainer.appendChild(button);
                    });
                    bubbleDiv.appendChild(buttonsContainer);
                }
                scrollToBottom();
            } else { // User message
                bubbleDiv.textContent = rawText;
                scrollToBottom();
            }
            return bubbleDiv; // Always return the bubbleDiv, whether new or existing
        };


        // Function to enable/disable input and send button
        const setInputState = (enabled) => {
            chatInput.disabled = !enabled;
            sendButton.disabled = !enabled;
            if (enabled) {
                sendButton.classList.remove('bg-blue-300', 'cursor-not-allowed'); /* OLD COLOR */
                sendButton.classList.add('bg-blue-600', 'hover:bg-blue-700', 'text-white', 'shadow-md', 'hover:shadow-lg'); /* OLD COLOR */
                chatInput.classList.remove('focus:ring-green-500'); /* Remove green focus ring */
                chatInput.classList.add('focus:ring-blue-500'); /* Add blue focus ring (OLD COLOR) */
            } else {
                sendButton.classList.add('bg-blue-300', 'cursor-not-allowed'); /* OLD COLOR */
                sendButton.classList.remove('bg-blue-600', 'hover:bg-blue-700', 'text-white', 'shadow-md', 'hover:shadow-lg'); /* OLD COLOR */
            }
        };

        // --- Initialization (simplified as Firebase is removed) ---
        const initChatbot = () => {
            setInputState(true); // Enable input and button immediately
            // No Firebase auth or history fetching needed
        };

        // --- Gemini API Interaction ---

        const sendChatMessage = async () => {
            const userQuestion = chatInput.value.trim();
            if (!userQuestion) return;

            // Add user message to UI immediately
            await addMessageToUI('user', userQuestion);
            chatInput.value = ''; // Clear input

            isLoading = true;
            setInputState(false); // Disable input and button
            chatbotWidget.classList.add('loading'); // Add loading class to widget for sparkle animation

            // Add a temporary AI loading message bubble with the new animation
            const aiLoadingBubbleElement = await addMessageToUI('gemini', '', true);

            try {
                // Construct the prompt by prepending marjoInfo and instructions
                const prompt = `You are Marjo's AI assistant. Your goal is to answer questions about Marjo Paguia, an architecture student and visual artist, in a friendly, conversational, and concise manner.

                **Instructions for your response:**
                - **Tone:** Be professional yet conversational, respectful, and helpful. Respond naturally like a real person.
                - **Information Source:** Use *only* the provided information about Marjo. Do not invent or assume any details.
                - **Handling Unknowns:** If a question cannot be answered solely from the given details, respond with: "I'm not sure about that based on the information I have about Marjo."
                - **Formatting Lists:** Format lists like skills, tools, work experience, awards, education, or services as clear bullet points.
                - **Formatting Links:** Use Markdown for links, e.g., [Facebook](https://www.facebook.com/...).
                - **Avoid Robotic Phrases:** Do not start responses with phrases like "Based on the information provided," "According to the data," "As per the details," or similar formal introductions.

                **Here is Marjo Paguia's profile:**
                ${marjoInfo}

                **User's Question:** "${userQuestion}"`;

                // For this API call, we send only the current prompt (stateless per turn)
                const payload = { contents: [{ role: "user", parts: [{ text: prompt }] }] };

                // IMPORTANT: Leave apiKey as an empty string. Canvas automatically provides it at runtime.
                const apiKey = "AIzaSyAzseidssxw0OO1TLdC-O5BXu3EncHf56I"; 
                const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(`API error: ${response.status} - ${errorData.error.message || 'Unknown error'}`);
                }

                const result = await response.json();

                if (result.candidates && result.candidates.length > 0 &&
                    result.candidates[0].content && result.candidates[0].content.parts &&
                    result.candidates[0].content.parts.length > 0) {
                    const aiResponseText = result.candidates[0].content.parts[0].text;
                    // Update the AI bubble with the full response, including typing and button processing
                    // Pass the aiLoadingBubbleElement to be updated
                    await addMessageToUI('gemini', aiResponseText, false, aiLoadingBubbleElement); 
                } else {
                    console.error("Unexpected API response structure:", result);
                    // Pass the aiLoadingBubbleElement for error message as well
                    await addMessageToUI('gemini', 'I apologize, I could not generate a response at this time. Please try again.', false, aiLoadingBubbleElement);
                }
            } catch (error) {
                console.error("Error communicating with Gemini API:", error);
                // Pass the aiLoadingBubbleElement for error message as well
                await addMessageToUI('gemini', `An error occurred: ${error.message}. Please try again.`, false, aiLoadingBubbleElement);
            } finally {
                isLoading = false;
                setInputState(true); // Re-enable input and button
                chatbotWidget.classList.remove('loading'); // Remove loading class from widget
                chatInput.focus();
            }
        };

        // --- Event Listeners ---

        // Function to close the chatbot
        const closeChatbot = () => {
            chatbotWidget.classList.remove('open');
            chatbotWidget.classList.add('closed');
            sparkleEmoji.classList.remove('rotated');
            popupMessage.classList.add('visible'); // Show popup when chatbot closes
        };

        // Toggle chatbot visibility and icon rotation
        chatbotWidget.addEventListener('click', (event) => {
            // If currently closed and clicked on the icon area
            if (chatbotWidget.classList.contains('closed') && chatbotWidget.contains(event.target)) {
                chatbotWidget.classList.remove('closed');
                chatbotWidget.classList.add('open');
                sparkleEmoji.classList.add('rotated');
                chatInput.focus();
                scrollToBottom();
                popupMessage.classList.remove('visible'); // Hide popup when chatbot opens
            }
        });

        // Close chatbot explicitly via 'X' button
        closeChatButton.addEventListener('click', (event) => {
            event.stopPropagation(); 
            closeChatbot();
        });

        // Close pop-up message
        closePopupButton.addEventListener('click', (event) => {
            event.stopPropagation(); 
            popupMessage.classList.remove('visible');
        });

        // Global click listener to close chatbot when clicking outside
        document.addEventListener('click', (event) => {
            // If the chatbot is open AND the click target is NOT inside the chatbot widget
            if (chatbotWidget.classList.contains('open') && !chatbotWidget.contains(event.target)) {
                closeChatbot();
            }
        });

        // Send message on button click
        sendButton.addEventListener('click', sendChatMessage);

        // Send message on Enter key press
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !isLoading) {
                sendChatMessage();
            }
        });

        // --- Initial Setup ---
        window.onload = () => {
            initChatbot(); // Initialize chatbot UI
            // Show the popup message after 3 seconds
            setTimeout(() => {
                // Only show if the chatbot is currently closed (icon state)
                if (chatbotWidget.classList.contains('closed')) {
                    popupMessage.classList.add('visible');
                }
            }, 3000); // 3000 milliseconds = 3 seconds
        };