#export FLASK_APP=app.py
#python -m flask run

import matplotlib
matplotlib.use('agg')
from flask import Flask, jsonify, render_template, request, url_for
import sys
import os
import numpy as np
import seaborn as sns
from matplotlib.ticker import FuncFormatter


sys.path.append(os.path.abspath("./model"))
from load_model import *

app = Flask(__name__)

#load mnist model
global model
model = get_model()

def create_graph(x_dat,y_dat):
   p = sns.barplot(x_dat, y_dat)
   p.set(xlabel='Number', ylabel='Percent')
   p.yaxis.set_major_formatter(FuncFormatter('{0:.0%}'.format))
   fig = p.get_figure()
   fig.savefig("./static/output.png")
   fig.clf()
   del p, fig
   return "output.png"


@app.route('/')
def load_index():
    return render_template('index.html')

@app.route('/api/mnist', methods=['POST'])
def mnist():
    input = (np.array(request.json) / 255.0)

    #predict!!
    predictions = model.predict(input.reshape(1,28,28,1))
    #print(predictions)
    labels = ["zero","one","two","three","four","five","six","seven","eight","nine"]
    return jsonify(results = [predictions.tolist(),url_for('static',filename=create_graph(labels,predictions.tolist()[0]))])

if __name__ == '__main__':
    app.debug = True
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)