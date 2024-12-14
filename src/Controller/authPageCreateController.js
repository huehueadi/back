import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import Screenshot from "../Models/DefaultPageModel.js";
import Image from "../Models/ImageModel.js";
import Link from "../Models/LinkModel.js";
import Pagee from "../Models/PageCreateSchema.js";
import Text from "../Models/TextModle.js";

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);  // Get the current file's URL
const __dirname = dirname(__filename);

// Create content function to return saved content data
export const createPagee = async (req, res) => {
    try {
        const { templateId } = req.params;
      const { pageTitle, slug, content } = req.body;
  
      // Validate the content types
      const findTemplate = await Screenshot.findById(templateId).populate('name');

      if(!findTemplate){
          return res.status(404).json({
              message: "Template not found",
              success: false
          });
      }
      const validTypes = ['text', 'image', 'link'];
  
      // Initialize an array to hold content IDs
      const contentIds = [];
  
      // Process each content item and create respective models
      for (const item of content) {
        const { type, data } = item;
  
        // Create the appropriate content based on type
        if (!validTypes.includes(type)) {
          return res.status(400).json({ error: `Invalid content type: ${type}` });
        }
  
        let contentData;
  
        if (type === 'text') {
          const { heading, description } = data;
          const newText = new Text({ heading, description });
          contentData = await newText.save();
        } else if (type === 'image') {
          const { url, image_description } = data;
          const newImage = new Image({ url, image_description });
          contentData = await newImage.save();
        } else if (type === 'link') {
          const { link, link_descrption } = data;
          const newLink = new Link({ link, link_descrption });
          contentData = await newLink.save();
        }
  
        // Push the created content data's ObjectId and type into the contentIds array
        contentIds.push({
          type,  // Content type (text, image, link)
          contentId: contentData._id,  // Store the ObjectId of the created content
        });
      }
  
      // Create the page with associated content
      const newPage = new Pagee({
        pageTitle,
        slug,
        content: contentIds,  // Store the content with references to con
        templateId:findTemplate.name
      });
  
      const savedPage = await newPage.save();
  
      res.status(201).json(savedPage);
    } catch (err) {
      console.error('Error creating page:', err);
      res.status(500).json({ error: 'Server error while creating page' });
    }
  };

// Page creation logic
// export const createPagee = async (req, res) => {
//     try {
//         const { templateId } = req.params;
//         const { pageTitle, slug, content, type } = req.body;

//         // Find the template by ID and populate its data
//         const findTemplate = await Screenshot.findById(templateId).populate('name');

//         if(!findTemplate){
//             return res.status(404).json({
//                 message: "Template not found",
//                 success: false
//             });
//         }

//         if (!['text', 'image', 'link'].includes(type)) {
//             return res.status(400).json({ error: 'Invalid page type' });
//         }

//         const contentIds = [];

//         // Process each content item and save it
//         for (const item of content) {
//             const contentData = await createContent(item);
//             contentIds.push(contentData._id);
//         }

//         // Create the new page with the contentIds
//         const newPage = new Pagee({
//             pageTitle,
//             slug,
//             content: contentIds,  // Array of content IDs
//             templateId: findTemplate.name, // Populate template data
//             type,
//         });

//         // Save the page
//         const savedPage = await newPage.save();

//         // Respond with the saved page
//         return res.status(201).json(savedPage);

//     } catch (err) {
//         console.error('Error creating page:', err);
//         return res.status(500).json({ error: 'Server error while creating page' });
//     }
// };

// Directory path for views
const viewsDirectory = path.join(__dirname, '../views');
export const getPageBySlug = async (req, res) => {
    try {
  
      // Find the page by slug and populate content (if any)
      const page = await Pagee.find()
      .populate('content.contentId') // Populate the contentId field with actual content
       // Optional: exclude __v field from the populated content models
     
      .populate('templateId'); // Optional: populate templateId field if you need details about the template

    // Check if the page exists
    if (!page) {
      return res.status(404).json({
        message: "Page not found",
        success: false
      });
    }
      console.log('Page found:', page);  // Debugging: Print the retrieved page to check the result
  
      // If the page doesn't exist, return a 404 page
      if (!page) {
        console.log('Page not found');  // Debugging: Print if the page is not found
        return res.status(404).json('404', { message: 'Page not found' });
      }
  
      // Read the files in the 'views' folder and check if the template exists
    //   fs.readdir(viewsDirectory, (err, files) => {
    //     if (err) {
    //       console.error('Error reading views directory:', err);
    //       return res.status(500).render('500', { message: 'Server error' });
    //     }
  
    //     const templateExists = files.includes(`${page.templateId}.ejs`);
    //     console.log('Template exists:', templateExists);  // Debugging: Check if the template file exists in the views directory
  
    //     if (!templateExists) {
    //       console.log('Template file not found:', `${page.templateId}.ejs`);  // Debugging: Print if the template is not found
    //       return res.status(400).render('error', { message: 'Template not found' });
    //     }
  
    //     // Render the template dynamically
    //     console.log('Rendering template:', page.templateId);  // Debugging: Print the template name being rendered
    //     res.render(page.templateId, {
    //       title: page.pageTitle,  // Pass pageTitle to the template
    //       slug: page.slug,        // Pass slug to the template
    //       content: page.content,  // Pass the populated content array
    //       templateId: page.templateId,  // Pass the templateId to the template
    //     });
    //   });
    } catch (err) {
      console.error('Error rendering page:', err);
      res.status(500).render('500', { message: 'Server error while rendering page' });
    }
  };
  

