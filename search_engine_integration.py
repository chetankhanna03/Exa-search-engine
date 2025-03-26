from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import exa_py
import os
from dotenv import load_dotenv
from waitress import serve


# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# Enable CORS for frontend requests
CORS(app)

# Configure Exa client
exa_api_key = os.getenv("EXA_API_KEY")
if not exa_api_key:
    raise ValueError("EXA_API_KEY not found in environment variables")

exa_client = exa_py.Exa(api_key=exa_api_key)

@app.route('/')
def home():
    """Render the search page"""
    return render_template('search_engine_frontend.html')   # Ensure file name matches

@app.route('/search', methods=['POST'])
def search():
    """Handle search requests"""
    data = request.get_json()
    query = data.get('query', '')

    if not query:
        return jsonify({'error': 'No query provided'}), 400
    
    try:
        # Call Exa API
        search_results = exa_client.search(
            query=query,
            num_results=10,
            use_autoprompt=True
        )
        print("Exa API response:", search_results)  # Debugging

        # Format results
        formatted_results = []
        if isinstance(search_results, dict):
            results_list = search_results.get('results', [])
            for result in results_list:
                formatted_results.append({
    'title': getattr(result, 'title', 'No Title'),
    'url': getattr(result, 'url', '#'),
    'snippet': (getattr(result, 'text', '')[:200] + '...') if getattr(result, 'text', '') else 'No content',
    'score': getattr(result, 'score', 0)
})



        elif hasattr(search_results, 'results'):
            for result in search_results.results:
                formatted_results.append({
    'title': getattr(result, 'title', 'No Title'),
    'url': getattr(result, 'url', '#'),
    'snippet': (getattr(result, 'text', '')[:200] + '...') if getattr(result, 'text', '') else 'No content',
    'score': getattr(result, 'score', 0)
})



        return jsonify({'results': formatted_results})

    except Exception as e:
        print(f"Error in search: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    # serve(app, host = '0.0.0.0', port = 3000)  # Production server
    app.run(host="127.0.0.1", port=5000, debug=True)  # Development server
