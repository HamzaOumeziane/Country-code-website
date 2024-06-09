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

app.post('/inserer-donnees', async (req, res) => {
    try {
        const { id_pays, nom_pays, capitale, langue_officielle, devise, fuseau_horaire } = req.body;

        const connection = await oracledb.getConnection(dbConfig);

        const result = await connection.execute(
            `BEGIN
                PAYS_API.inserer_pays(:id_pays, :nom_pays, :capitale, :langue_officielle, :devise, :fuseau_horaire);
            END;`,
            { id_pays, nom_pays, capitale, langue_officielle, devise, fuseau_horaire }
        );

        await connection.commit();

        console.log(result);
        console.log('Insertion terminée avec succés');

        res.send('Insertion réussie');
    } catch (err) {
        console.error(err);

        res.status(500).send('Erreur lors de l\'insertion');
    }
});

app.listen(port, () => {
    console.log(`Serveur en cours d'exécution sur http://localhost:${port}`);
});