Tilgængelige modeller kan altid ses via endpointet `/v1/models`. Og der er eksempler i [../eksempler/](eksempler/).

```bash
curl -X 'GET' \
  -H "Authorization: Bearer $(rbw get intern-pud-llm-token --field=token)" \
  'http://glyph-gate-1-0.ai-prod.svc.cloud.dbc.dk/v1/models' \
  -H 'accept: application/json'
```

Modelnavnet, der bruges i `model`-parameteren, er modellens `id` i modelkortene.

# Modelvalg

| Use case | Model | Tool Calling | Image Input | Reasoning modus | Context Window |
|----------|------|--|----|----|----|
| Hurtigt / Billig | Gemma3 12B | x | | | 32K |
| Conversational Agent | Mistral3 24B | x | x | | 32K |
| Image + Text | Qwen3-VL-8B | x | x | | 32K |
| Reasoning / Kode Agent | Qwen3.6 35B | x | | optional (by default true) | 131K |


# 1. Gemma 3 – 12B

Model: `google/gemma-3-12b-it` 

HuggingFace  
https://huggingface.co/google/gemma-3-12b-it

Styrker
- Hurtig
- Lav GPU belastning

Brug den til
- Chatbots
- Klassifikation
- Hurtige svar


# 2. Mistral Small 3.1 (24B Instruct)

Model: `mistral/Mistral-Small-3.1-24B-Instruct`

HuggingFace  
https://huggingface.co/mistralai/Mistral-Small-3.1-24B-Instruct-2503

Styrker
- God til agents og workflows
- Tool calling (native)
- Kan også håndtere image input

Brug den til
- Conversational Agents og tool calling
- Multimodal input (f.eks. image + text to text)
- API orchestration
- Dokumentanalyse

# 3. Qwen3-VL (8B Instruct)

Model: `Qwen/Qwen3-VL-8B-Instruct`

HuggingFace  
https://huggingface.co/Qwen/Qwen3-VL-8B-Instruct

Styrker
- Vision Language model: godt til alle billede-relateret opgaver

Brug den til
- Generel ræsonnering over et billede ud fra en prompt eller instruktion
- Generering af Draw.io/HTML/CSS/JS fra billederne
- Genkendelse af personer, anime, plater, dyr, etc. på billedet
- Ekstraher text fra billedet (OCR)

# 4. Qwen3.6 (35B-A3B-Instruct)

Model: `Qwen/Qwen3.6-35B-A3B`

HuggingFace  
https://huggingface.co/Qwen/Qwen3.6-35B-A3B

Styrker
- God til kode
- Stærk reasoning
- Balanceret performance

Brug den til
- Problemløsning
- Dataanalyse
- Kodegenerering