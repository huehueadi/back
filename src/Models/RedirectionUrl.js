import mongoose from "mongoose";

const redirectSchema = new mongoose.Schema({
    redirection_url: {
        type: String,
        required: true
    }
});

const Redirect = mongoose.model("Redirect", redirectSchema);

export default Redirect;
