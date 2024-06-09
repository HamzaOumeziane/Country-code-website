const express = require('express');
const bodyParser = require('body-parser');
const oracledb = require('oracledb');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

const dbConfig = {
    user: 'SCOTT',
    password: 'oracle',
    connectString: 'localhost:1521/freepdb1'
};

app.post('/select-donnees', async (req, res) => {
    try {
        const { id_pays } = req.body;

        const connection = await oracledb.getConnection(dbConfig);

        const result = await connection.execute(
            `BEGIN 
            PAYS_API.selectionner_pays(:id_pays);`,
            {id_pays},
            
        );

        await connection.close();

        // Envoyer les résultats au client (dans cet exemple, ils sont envoyés sous forme de JSON)
        res.status(200).json(result.rows);
        
    } catch (err) {
        console.error(err);

        res.status(500).send('Erreur lors de la sélection');
    }
});

app.listen(port, () => {
    console.log(`Serveur en cours d'exécution sur http://localhost:${port}`);
});

