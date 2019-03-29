from chatterbot import ChatBot
import sys


# Uncomment the following line to enable verbose logging
# logging.basicConfig(level=logging.INFO)

# Create a new ChatBot instance
chatbot = ChatBot('Terminal',
   storage_adapter="chatterbot.adapters.storage.JsonFileStorageAdapter",
    database="./database.json",
    silence_performance_warning=True,
    logic_adapters=[
        'chatterbot.adapters.logic.ClosestMatchAdapter'
    ],
    filters=[
        'chatterbot.filters.RepetitiveResponseFilter'
    ],
    read_only=True,
    trainer='chatterbot.trainers.ChatterBotCorpusTrainer'
)

response = chatbot.get_response(sys.argv[1])
print(response)
