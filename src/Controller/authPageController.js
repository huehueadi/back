import Content from "../Models/ContentModel.js";
import Page from "../Models/PageModel.js";

const createContentBlock = async (type, data) => {
    const content = new Content({
      contentType: type,
      contentData: data
    });
    await content.save();
    return content;
  };
export const createPage = async (req, res)=>{
    try {
    const { title, slug, template, contentArray } = req.body;
    const contentIds = [];
    for (const content of contentArray) {
      const contentBlock = await createContentBlock(content.type, content.data);
      contentIds.push(contentBlock._id);
    }
    const flowpage = new Page({
      title,
      slug,
      template,
      content: contentIds
    });
    await flowpage.save();
    res.send(`Flowpage created with slug: ${slug}`);
    
  }
    catch (error) {
        console.log(error)

        res.status(500).json({
            message:"Internal server error",
            success:false
        })
        
    }
}

// export const getPage = async (req, res)=>{
//     try {
//         const { slug } = req.params;
//         const flowpage = await Page.findOne({ slug }).populate('content');

//   if (!flowpage) {
//     return res.status(404).send('Flowpage not found');
//   }

  
//   res.render('flowpage', { flowpage });

//     } catch (error) {
//         console.log(error)
//         res.status(500).json({
//             message:"Internal Server error",
//             success:false
//         })
//     }
// }

export const getPage = async (req, res)=>{
    try {
        const {slug} = req.params;
        const flowpage = await Page.findOne({slug}).populate('content');

        if(!flowpage){
            return res.status(404).send('Flowpage not found');
        }
        const template = flowpage.template || 'defaultTemplate'; 

        res.render(template, { flowpage });
        } catch (error) {
        res.status(500).json({
            message:"Internal server error",
            success:false
        })
    }
}

export const getAllPages = async(req, res)=>{
    try {
        const allPages = await Page.find()

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