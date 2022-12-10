const router = require('express').Router();

/** 
  * ESTOS ENDPOINTS SON DE PRUEBA PARA EL MINI CURSO DE BACKEND QUE DIO HECTOR
  * NO LSO BORREN POR AHORA PARA QUE SIRVAN COMO REFERENCIA A ALGUNAS PERSONAS
  **/

const students = [
  {
      name: "Jesus Ortiz UwU",
      semestre: 5,
      ucabistaIntegral: false
  },
  {
      name: "Emmanuel :)",
      semestre: 6,
      ucabistaIntegral: true
  },
  {
      name: "Nahum",
      semestre: 1000000,
      ucabistaIntegral: true,
      chichero: true
  }
];

// Este es un endpoint de prueba para aprender a usar endpoints :)
router.get('/ucab-students', (req, res) => {

  if (!!req.query.onlyIntegrals === true)  {
      return res.status(200).json(
          students.filter((student) => { return student.ucabistaIntegral === true }
      ));
  }

  return res.status(200).json(students);
});

router.post('/ucab-students', (req, res) => {
  console.log('Hay un nuevo estudiante UwU', req.body);
  students.push(req.body);
  return res.status(200).json({
      message: "Jesus funao >:v",
      success: true
  });
});

module.exports = router;