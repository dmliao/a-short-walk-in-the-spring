from chatterbot import ChatBot


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
    input_adapter='chatterbot.adapters.input.TerminalAdapter',
    output_adapter='chatterbot.adapters.output.TerminalAdapter',
    trainer='chatterbot.trainers.ChatterBotCorpusTrainer'
)
while True:
    try:
        bot_input = chatbot.get_response(None)

    # Press ctrl-c or ctrl-d on the keyboard to exit
    except (KeyboardInterrupt, EOFError, SystemExit):
        break