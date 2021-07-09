import react, { useState, useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import { COLORS, MARGIN } from '../styles/constants';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { toast, ToastContainer } from 'react-toastify';
import { BooksApi } from '../api/BooksApi';
import { setLoading } from '../store/actions/isLoading';
import { setBookList } from '../store/actions/bookList';
import { useDispatch, useSelector } from 'react-redux';
import { uniqId } from '../utils/auth';



const CssTextField = withStyles({
    root: {
        '& label.Mui-focused': {
            color: COLORS.accentColor,
        },
        '& .MuiInput-underline:after': {
            borderBottomColor: COLORS.accentColor,
        },
    },
})(TextField);

const useStyles = makeStyles((theme) => ({
    accentColor: {
        background: COLORS.accentColor,
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    select: {
        '&:before': {
            borderColor: COLORS.accentColor,
        },
        '&:after': {
            borderColor: COLORS.accentColor,
        }
    },
    margin_1: {
        marginTop: MARGIN.margin_1,
        marginBottom: MARGIN.margin_1,
    },
    margin_2: {
        marginBottom: MARGIN.margin_2,
        marginTop: MARGIN.margin_2,
    },
    margin_3: {
        marginBottom: MARGIN.margin_3,
        marginTop: MARGIN.margin_3,
    },

}));

export default function AddBookModal({ ...props }) {
    const classes = useStyles();
    const [bookName, setBookName] = useState("");
    const [category, setCategory] = useState("رمان");
    const [fileData, setFileData] = useState();
    const [responseNewBook, setResponseNewBook] = useState();
    const dispatch = useDispatch();
    const [selectedFile, setSelectedFile] = useState();
    const bookList = useSelector((store) => store.bookList.bookList);

    function addbook(e) {
        e.preventDefault();
        let maxId = uniqId(bookList)
        if (bookName && category) {
            let book = {
                id: maxId + 1,
                name: bookName,
                subject: category,
                img: fileData
            }
            setResponseNewBook(BooksApi(book, 'post', 'http://localhost:5000/books/'));
            dispatch(setLoading(true));
            setTimeout(() => {
                dispatch(setLoading(false));
            }, 1000);

        }
    }
    // useEffect(() => {
    //     console.log("responseNewBook")

    //     if (responseNewBook) {
    //         responseNewBook.then((x) => {
    //             console.log("responseNewBook")

    //             if (x.status === 201) {
    //                 // console.log("responseNewBook")
    //                 toast.success("ok");
    //             } else {
    //                 toast.success("no");
    //             }
    //         });
    //     };

    // }, [responseNewBook])

    const handleFileInput = (e) => {
        const file = e.target.files[0];
        console.log(file);
        if (file) {
            setSelectedFile(file);
            const fileReader = new FileReader();
            fileReader.onload = () => {
                console.log('successfully read file = ' + fileReader.result);
                setFileData(fileReader.result);
            }
            fileReader.onerror = (error) => {
                console.log('failed to read file!', error);
            }
            fileReader.readAsDataURL(file);
        }
    };

    return (
        <Container maxWidth="lg">
            <Typography variant="h6" className={classes.margin_2}>
                افزودن / ویرایش کالا
            </Typography>
            <form noValidate onSubmit={(e) => addbook(e)}>
                <Button
                    className={classes.margin_1}
                    variant="contained"
                    component="label"
                >
                    <input
                        type="file"
                        onChange={handleFileInput}
                    />
                </Button>
                <CssTextField
                    className={classes.margin_1}
                    required
                    fullWidth
                    label="نام کتاب"
                    value={bookName}
                    onChange={(e) => setBookName(e.target.value)}
                />
                <FormControl style={{ width: "100%" }} className={classes.margin_1}>
                    <InputLabel required style={{ color: COLORS.accentColor }}>دسته‌بندی</InputLabel>
                    <Select
                        native
                        className={classes.select}
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <option value="رمان">رمان</option>
                        <option value="کودک">کودک</option>
                        <option value="تاریخی">تاریخی</option>
                        <option value="روانشناسی">روانشناسی</option>
                        <option value="غیره">غیره</option>
                    </Select>
                </FormControl>
                <Button
                    type="submit"
                    variant="contained"
                    className={classes.margin_3}
                    style={{ background: COLORS.accentColor }}
                    fullWidth
                >
                    <Typography variant="h6">
                        ذخیره
                    </Typography>
                </Button>
            </form>

        </Container>
    )
}


// AddBookModal