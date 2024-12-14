import Screenshot from "../Models/DefaultPageModel.js";
import Page1 from "../Models/Page1Model.js";

// export const createpage1 = async(req, res)=>{
  
//     const {templateId} = req.params
//     const { pageTitle, slug, content } = req.body;
//     try {

//       const templates = await Screenshot.findById(templateId)
//       const newPage = new Page1({
//         pageTitle,
//         slug,
//         templateId:templates.name,
//         content
//       });
  
//       await newPage.save();
//       res.status(201).json(newPage);
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ message: 'Error creating page' });
//     }
//   };
export const getapge1 = async (req, res) => {
  try {
    const { slug } = req.params;
    const page = await Page1.findOne({ slug })
    if (!page) {
      return res.status(404).json({ message: 'Page not found' });
    }

    const template = page.templateId || 'defaultTemplate';
    res.render(template, { page });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
    export const getAllPage = async(req, res)=>{
      try {
          const allPages = await Page1.find().select('slug')
  
          res.status(200).json({
              message:"fetched pages",
              success:true,
              allPages
          })
      } catch (error) {
          res.status(500).json({
              message:"Internal server error",
              success:false
          })
      }
  }


  export const createPage1 = async (req, res) => {
    try {
      const {templateId} = req.params 
      const { pageTitle, slug, content } = req.body;
      
      const template = await Screenshot.findById(templateId)
      
      const newPage = new Page1({
        pageTitle,
        slug,
        templateId: template.name,
        content,
      });
  
      const savedPage = await newPage.save();
      res.status(201).json(savedPage);
    } catch (error) {
      console.error("Error creating page:", error);
      res.status(500).json({ message: "Error creating page", error });
    }
  };