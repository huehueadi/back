import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
 
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
 
const viewsFolderPath = path.join(__dirname, '..', 'views');
export const getdefaultTemplate = async (req, res) => {
try {
  const { name } = req.params;
 
  const templatePath = path.join(viewsFolderPath, `${name}.ejs`);
 
  const fileExists = await fs
    .access(templatePath)
    .then(() => true)
    .catch(() => false);  
 
  
  const page = {
    title: name,
    slug: name,
    content: [  
    { contentType: "text", contentData: "Welcome to the default flowpage!" },
    { contentType: "text", contentData: "This is the fallback content for unknown flowpages." },
    { contentType: "text", contentData: "This is the fallback content for unknown flowpages." },
    { contentType: "text", contentData: "This is the fallback content for unknown flowpages." },
    { contentType: "text", contentData: "This is the fallback content for unknown flowpages." },
    { contentType: "text", contentData: "This is the fallback content for unknown flowpages." },
    { contentType: "link", contentData: "https://default-link.com" },
    { contentType: "image", contentData: "//via.placeholder.com/300" }
    ]
  };
 
  return res.render(name, { page });
} catch (error) {
     res.status(500).json({
      message:"Internal server error",
      success:false
     })
}
};