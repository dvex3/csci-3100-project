Installation Instruction
2.1 Azure OpenAI API
To obtain the Azure OpenAI key and endpoint:
You must first register for a valid Microsoft Azure account. You may create the Azure account with an existing Microsoft account as well. After account creation, you should have a valid subscription option / method
Go to Azure Portal. Under Azure services, select the Foundry icon. You will be directed to the overview page. On the left side panel, under “Use with Foundry”, select Foundry. Select “+ Create” on the horizontal bar  to create a Foundry Resource. Only fill in the “1. Basics” category. Create a new Resource group if necessary. Set “Region” to “East US 2”.
After creation, go to Azure Portal. Under Azure services, select the Foundry icon. You will be directed to the overview page. On the left side panel, under “Use with Foundry”, select Foundry. You will see the new resource you have created. Click on the name of the new resource you just created. Click “Go to Foundry portal”
In the Azure Foundry webpage, on the left side panel, under “My assets/Models + endpoints” click “+ Deploy model”, then click “Deploy base model”.  Select “gpt-4.1” and click confirm. Specify Deployment type = “Standard”. Click “connect and deploy”. Obtain the API key and endpoint for the model you just created.

For the administrator hosting the application, prepare the .env file and put it right under  the directory named “backend”. The .env file follows the following format:
AZURE_OPENAI_KEY="insert_your_key_here"
AZURE_OPENAI_ENDPOINT="insert_your_endpoint_here"

2.2 Frontend 
Use any package manager to download the package(e.g. npm/pnpm)
Run the frontend (e.g. npm run dev)
Web page available at https://localhost:3000

2.3 Backend
Create and activate virtual environment
Install dependencies
Run server
Api documentation available at ‘/api/v1/ui’
