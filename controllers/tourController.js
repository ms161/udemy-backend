const fs = require('fs');
const Tour = require('./../models/tourModel')
const APIFeatures = require('../utils/apiFeatures')
// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );



exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5'
  req.query.sort = '-ratingsAverage,price'
  req.query.fields = 'name, price , ratingsAverage , summary , difficulty'
  next()
}

exports.checkID = (req, res, next, val) => {
  console.log(`Tour id is: ${val}`);

  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID'
    });
  }
  next();
};

exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'fail',
      message: 'Missing name or price'
    });
  }
  next();
};

exports.getTourStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } }
      },
      {
        $group: {
          _id: { $toUpper: '$difficulty' },
          numTours: { $sum: 1 },
          numRating: { $sum: '$ratingsQuantity' },
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' }
        },
      },
      {
        $sort: { avgPrice: 1 }
      },
      // {
      //   $match: { _id:{$ne: 'EASY'}}
      // }
    ])
    res.status(200).json({
      status: 'success',
      stats: stats
    })
  } catch (error) {
    console.log(error)
  }
}

exports.getMonthlyPlan = async (req, res) => {

  try {
    const year = req.params.year * 1
    console.log(new Date(`${year}-01-01`))
    const plan = await Tour.aggregate([
      {
        $unwind: '$startDates'
      },m 
      // {
      //   $match: {
      //     startDates:{$gte:new Date(`${year}-01-01`)}
      //   }
      // },
      // {
      //   $group:{
      //     _id:'$difficulty'
      //   }
      // }
    ])

    res.status(200).json({
      status: 'success',
      requestedAt: req.requestTime,
      // totalItems: numTours,
      data: {
        plan
      }
    });

  } catch (error) {
    console.log(error)
    res.status(500).json({
      status: 'fail',
      requestedAt: req.requestTime,
      error,
    });
  }

}

exports.getAllTours = async (req, res) => {
  try {
    // Execute Query
    const features = await new APIFeatures(Tour.find(), req.query).filter().sort().limitFields().paginate()
    const tours = await features.query
    // Send response
    res.status(200).json({
      status: 'success',
      requestedAt: req.requestTime,
      results: tours.length,
      // totalItems: numTours,
      data: {
        tours
      }
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({
      status: 'fail',
      error: error
    })
  }

};

exports.getTour = (req, res) => {
  console.log(req.params);
  const id = req.params.id * 1;

  const tour = tours.find(el => el.id === id);

  res.status(200).json({
    status: 'success',
    data: {
      tour
    }
  });
};

exports.createTour = async (req, res) => {
  // console.log(req.body);

  const tour = await Tour.create(req.body)
  res.status(201).json({
    status: 'success',
    data: {
      tour: tour
    }
  });
};

exports.updateTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour here...>'
    }
  });
};

exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null
  });
};
