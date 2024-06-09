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

app.post('/supprimer_pays', async (req, res) => {
    try {
        const { id_pays } = req.body;

        const connection = await oracledb.getConnection(dbConfig);

        const result = await connection.execute(
            `BEGIN
                PAYS_API.supprimer_pays(:id_pays);
            END;`,
            { id_pays }
        );

        await connection.commit();

        console.log(result);
        console.log('Suppresion terminée avec succés');

        res.send('Suppresion réussie');
    } catch (err) {
        console.error(err);

        res.status(500).send('Erreur lors de la suppresion');
    }
});

app.listen(port, () => {
    console.log(`Serveur en cours d'exécution sur http://localhost:${port}`);
});