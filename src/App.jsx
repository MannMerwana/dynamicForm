
import React, { useEffect, useState } from "react";
import { useForm,useFieldArray} from "react-hook-form";




function App() {
  {/* From the useForm hook we have used all the methods like register,watch,control,handleSubmit,fromState,reset . */}
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      fields: JSON.parse(localStorage.getItem("formStructure")) || [],
    },
  });
  { /* As, we are dealing with dynamic form input , we are using useFieldArray to perform crud operations and mange dynamic inputs*/}

  const { fields, append, remove } = useFieldArray({
    control,
    name: "fields ",
  });

  

  const selectedType = watch("category");//watch field from useFieldArray is a method which helps to track the changes in the input.
  const [preview,setPreview] = useState(false);
        //as everytime the page loads,we need to track the changes made,so we are using useEffect hook to track the immediate mounting and unmounting.
        //load existing form structure from local storage
        useEffect(()=>{

              //store the data from local storage into a variable 
              const savedData=localStorage.getItem("formStructure");
              //if we get saved data from local storage ,we simple reset the localstorage.
              if(savedData){
                reset({fields:JSON.parse(savedData)});
              }
        },[reset])//as reset is our field for dependency array,if reset is changed,we should be able to rerender form and see the updated changes.



  // Function to handle checkbox state
  const handleCheckboxChange = (index, e,checkboxIndex) => {
     setValue(`fields.${index}.value`, e.target.checked);
   

  };

  //function to add new field with default values with the help of append method of useFieldArray which appends the inputs to the end of the fields.
  const addNewFields = () => {
    if (selectedType) {
      append({
        type: selectedType,
        label: "",
        options: selectedType === "checkbox" ? ["Option 1", "Option 2"] : [],
        value:
          selectedType === "checkbox"
            ? false
            : selectedType === "dropdown"
            ? "option 1"
            : "",
      });
    }
  };

  //function to render the appropriate input field
  //with the help of switch case, based on user's selected field type we are adding the new field. 
  // Ex- user selects input type text,we check that with "text" string ,and if that matches,we dynamically add an text input field.app
  const renderInputFields = (field, index) => {
    switch (field.type)
     {
      case "text":
        return (
          <>
            <input
              className="text-black w-[50%] "
              placeholder="Enter text here...."
              required
              {...register(`fields.${index}.value`)}
            />
            {errors.fields?.[index]?.value && (
              <p className="text-red-500">
                {errors.fields[index].value.message}
              </p>
            )}
          </>
        );
      case "checkbox":
        return (
          <>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="text-black"
                  {...register(`fields.${index}.value[0]`, {
                    required: "Please select at least one option",
                  })}
                />
                <span>{field.options?.[0] || "Option 1"}</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="text-black"
                  {...register(`fields.${index}.value[1]`, {
                    required: "Please select at least one option",
                  })}
                />
                <span>{field.options?.[1] || "Option 2"}</span>
              </div>
            </div>

            {errors.fields?.[index]?.value && (
              <p className="text-red-500">
                {errors.fields[index].value.message}
              </p>
            )}
          </>
        );
      case "dropdown":
        return (
          <>
            <select
              className="text-black  w-[50%]  "
              required
              {...register(`fields.${index}.value`, {
                required: "Please select an option",
              })}
            >
              <option value="option1">Option 1</option>
              <option value="option2">Option 2</option>
              <option value="option3">Option 3</option>
            </select>
            {errors.fields?.[index]?.value && (
              <p className="text-red-500">
                {errors.fields[index].value.message}
              </p>
            )}
          </>
        );
      default:
        return null;
    }
  };

  //handle form submit
const onSubmit = (data,e) => {
  e.preventDefault();
  console.log("Form Submitted:", data);
  localStorage.setItem("formStructure", JSON.stringify(data.fields));
  alert("Form structure saved! Click 'Preview' to view.");
};
//handle submit on final submission
const handleFinalSubmit = (data,e) => {


   e.preventDefault();
  alert("Form submitted successfully!");
  localStorage.setItem("submittedFormData", JSON.stringify(data.fields));
  console.log("Submitted Form Data:", data.fields);
  
};

  return (
    <>
      <h1 className="  text-center pb-10 ">Dynamic Form Builder</h1>
      //when user directly submits the form without using preview show him this form and on submit ,store data in the localstorage.
      {!preview ? (
        <form
          className="flex  flex-col  h-full w-[98%] justify-center align-center  ml-1 gap-3 bg-black text-white  align-center      border border-white "
          onSubmit={handleSubmit(onSubmit)}
        >
          <fieldset className="flex flex-col gap-5 ml-[5%] ">
            <label htmlFor="">
              Choose One Of The Input Fields Below ,to Dynamically Add Them:
            </label>
            <select className="text-black w-[50%] " {...register("category")}>
              <option value="">Select...</option>
              <option value="text">Text</option>
              <option value="checkbox">Checkbox</option>
              <option value="dropdown">Dropdown</option>
            </select>
          </fieldset>

{/* {//Mapping through each form field to render them on the screen.} */}
          {fields.map((field, index) => (
            <section
              key={field.id}
              className=" flex flex-col gap-3 ml-5 w-[85%] align-center justify-center "
            >
              <input
                className="text-black"
                {/* using the register method from register,we are taking an input and applied basic form validations.*/}
                {...register(`fields.${index}.label`, {
                  required: "Label is required",
                })}
              />
              {errors.fields?.[index]?.label && (
                <p className="text-red-500">
                  {errors.fields[index].label.message}
                </p>
              )}
              {/* */}
              {renderInputFields(field, index)}
              <button
                className="w-[24%] rounded-md bg-red-500 hover:bg-red-700 hover:font-medium"
                type="button"
                onClick={() => remove(index)}
              >
                Delete
              </button>
            </section>
          ))}
          <button
            className=" border  sm:w-[15%]  w-[30%] lg:w-[20%] md:w-[20%]  sm:[w-20%] ml-[5%] bg-sky-400 rounded-md outline-none border-none  hover:bg-blue-700 hover:font-medium"
            type="button"
            onClick={addNewFields}
            //onClick={() => append({ name: "" })}
          >
            Add Field{" "}
          </button>
          <button
            className=" ml-[30%] w-[40%] rounded-md bg-green-400  hover:bg-green-500 hover:font-medium"
            type="submit"
          >
            Save Form
          </button>
          <button
            className="ml-[30%] w-[40%]  bg-orange-400 text-black hover:bg-orange-600 hover:text-white hover:font-medium mb-5 rounded-md"
            type="button"
            onClick={() => setPreview(true)}// on click we are setting preview to true.
          >
            Preview Form
          </button>
        </form>

      ) : 
      //when user selects preview button,this form must be rendered which shows which type of input field user selected and what was the input value.
      
      (
        //On Preview ,form will be like this:
        <form
          className="flex flex-col  min-h-10  w-full gap-5 text-white  border border-white  p-16 "
          onSubmit={handleSubmit(handleFinalSubmit)}
        >
          <h2 className="text-center ">Form Preview</h2>
          {fields.length === 0 && <p>No fields added.</p>}
          {fields.map((field, index) => (
            <div key={index} className="flex flex-col gap-2">
              <label className="font-bold">
                {field.label || `${field.type}`}
              </label>
              {field.type === "text" && (
                <input
                  className="text-black"
                  type="text"
                  {...register(`fields.${index}.value`, {
                    required: "This field is required",
                  })}
                />
              )}
              {field.type === "checkbox" && (
                <input
                  type="text"
                  className="text-black"
                  // checked={field.value}
                  {...register(`fields.${index}.value`, {
                    required: "This field is required",
                  })}
                />
              )}

              {field.type === "dropdown" && (
                <input
                  className="text-black"
                  rea
                  {...register(`fields.${index}.value`, {
                    required: "Please input an option",
                  })}
                ></input>
              )}
            </div>
          ))}

          <button
            className=" border p-2 text-black bg-orange-400 hover:bg-orange-500 hover: rounded-sm outline-none border-none hover:text-white"
            type="button"
            onClick={() => setPreview(false)}
          >
            Back to Edit Mode
          </button>
          <button
            className=" border p-2 text-black hover:text-white bg-green-400 hover:bg-green-500 hover: rounded-sm outline-none border-none"
            type="submit"
          >
            Submit Final Form
          </button>
        </form>
      )}
    </>
  );
}

export default App;
