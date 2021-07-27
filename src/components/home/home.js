import React, { useEffect, useState } from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import './styles.css';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
    formControl: {
      minWidth: 200,
      marginLeft: '40%',
      marginTop: '10%',
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  }));
  

export const Home = () => {
    const classes = useStyles();
    const [region, setRegion] = useState('');
    const [isDisabled, setIsDisabled] = useState(false);
    const [code, setCode] = useState("");
    const [regionCodeData, setRegionCodeData] = useState([]);
    const [departmentData, setDepartmentData] = useState([]);
    const [regionName, setRegionName] = useState("");

    const handleSelectChange = (event) => {
        setRegion(event.target.value);
    };

    const handleTextChange = (event) => {
        setCode(event.target.value);
    };

    useEffect(()=>{
    code.length > 0 ? setIsDisabled(true) : setIsDisabled(false);
    }, [code])
    

    const Search = () => {
        let number=0;
        let regionName="";
        if(code.length > 0){
            number = code;
        }
        else {
           regionName = regionCodeData.filter((element)=> element.nom === region);
           number=regionName[0].code;
        }

        axios.get(`https://geo.api.gouv.fr/regions/${number}/departements`)
        .then((res)=>{setDepartmentData(res.data);})
        .catch(()=>alert("You entered wrong data!"));
    }

    useEffect(()=>{
        axios.get(`https://geo.api.gouv.fr/regions`).then((res)=>{
            setRegionCodeData(res.data);
        })
        .catch((err)=>console.log(err));
    }, [])

    useEffect(()=>{
        if(departmentData.length >0){
            let number = 0;
            if(departmentData[0] !==undefined)
             number = departmentData[0].codeRegion;
            axios.get(`https://geo.api.gouv.fr/regions/${number}`).then((res)=>{
                setRegionName(res.data.nom)
            })
            .catch((err)=>console.log(err));
        }
    }, [departmentData])
    
    return (
    <div>
        <FormControl variant="outlined" className={classes.formControl}>
        <InputLabel id="demo-simple-select-outlined-label">Region</InputLabel>
        <Select
          labelId="demo-simple-select-outlined-label"
          id="demo-simple-select-outlined"
          value={region}
          onChange={handleSelectChange}
          label="region"
          disabled={isDisabled}
        >
           {regionCodeData?.map((item) => {
          return (
            <MenuItem key={item.nom} value={item.nom}>
              {item.nom}
            </MenuItem>
          );
      })}
        </Select>

        <TextField className="text-input" id="outlined-basic" label="Outlined" variant="outlined" value={code} onChange={handleTextChange} />
        <button className="search" onClick={Search}>
        Search
        </button>
      </FormControl>


      {departmentData.length > 0 && regionName.length > 0 &&
          <div className="lists-container">
              {departmentData?.map((item)=>{
                return  <li className="list" key={item.nom}>The code of the department "{item.nom}" is {item.code}, and it belongs to the "{regionName}" region.</li>
              })}
          </div>}
    </div>
    )
}