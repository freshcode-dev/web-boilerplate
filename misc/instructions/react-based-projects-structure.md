[//]: # (
	Original text is stored on the google disk. 
	Don't put anything here before changing the original file
	https://docs.google.com/document/d/1hqsJBXU1G16tJSShGBk673XNVe_0uazB8I4TH_g3Zqo/edit?usp=sharing
)

[//]: # (
	Converted with https://products.aspose.app/words/conversion/docx-to-md
)

# React-based projects structure

We do consider proper structuring and code separation is one of the most important things when starting a new project. Strictly defined boundaries help projects grow better and reduce the risks of getting the "big mud of ball" at some point.

On the other hand, excess strictness sometimes makes developers spend a lot of time thinking and discussing where to place a new component.

As we think, the truth is somewhere in the middle. We consider thinking of modules as groups of coupled components, serving relatively the same functionality of the app. The main goal is not to make such modules completely replaceable and reusable (as in lots of cases it's mostly idealistic and unachievable), but in the first place to easily navigate through the app.

-----
## Modularity rules to follow
1) When you can clearly see the feature of the app, your new piece of code is needed for, do a module
1) When some code can be pertinently reused in multiple modules, put it into `\_core`
1) When you don't know where to place your new code yet, feel free to place it on `\_core`. But remember it's completely undesirable
1) Even when it's not required, try thinking of modules as some closed part of the app. So you should always prefer importing from inside the module over from the outside
1) Each module should declare its own root index.ts file, defining what parts of the module are public to the outside world and can be reused.  Cross-module imports are only allowed through the module's "public API"
1) Any part of any module can import anything from the `\_core`
1) Each module should have a strict structure described below
-----
### !!! Important
**To make eslint automatically control modules boundaries, add the next rule to project-level `eslint` config. It's strongly recommended adding a new module to the list as soon as you create it.**

```json
{
	"no-restricted-imports": ["error", {
		"patterns": [{
			"group": ["**/module1/*/**", "**/module2/*/**"],
			"message": "To import from this module, please use the module's index file"
		}]
	}]
}
```

-----
## Desired modular structure
| <div style="width:300px">Directory</div>     | purpose                                                                                                                                                                                                                                                                            |
|----------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| ` assets/`                                   | Folder for assets                                                                                                                                                                                                                                                                  |
| ` modules/`                                  | Folder to store modules                                                                                                                                                                                                                                                            |
| ` ├─\_core/`                                 | Main/shared/common/core module of the system. We should use it only for code that can be reused in several modules. Use the same structure as describred for modules/[module]                                                                                                      |
| ` ├─[module]/`                               | Module folder. Module is some part of the application that connects different parts of the code, which can be connected by common main entity, business logic, etc. There is no strict restriction of not having cross-module dependencies, but rather a way to organize the code. |
| ` │    ├─index.ts`                           | Public API of the module. Our way to strictly define, what modules can be reused outside of the module. Export only needed parts of code, don't export any code used only inside the module.<br>***(Can be skipped for \_core/ module to not export each common component)***      |
| ` │    ├─areas/`                             | High-level groups of pages (e.g. authorized, unauthorized, etc.)                                                                                                                                                                                                                   |
| ` │    │   └─[area]/area.tsx`                | Area file                                                                                                                                                                                                                                                                          |
| ` │    ├─components/`                        | Folder for react components                                                                                                                                                                                                                                                        |
| ` │    │   ├─_ui/`                           | Sub-folder to store UI components                                                                                                                                                                                                                                                  |
| ` │    │   └─[component]/`                   | Component folder                                                                                                                                                                                                                                                                   |
| ` │    │        ├─[component].component.tsx` | Component file                                                                                                                                                                                                                                                                     |
| ` │    │        ├─[component].styles.ts`     | Component styles file                                                                                                                                                                                                                                                              |
| ` │    │        └─[component].types.ts`      | Component typings file                                                                                                                                                                                                                                                             |
| ` │    ├─constants/`                         | Constants folder                                                                                                                                                                                                                                                                   |
| ` │    │   ├─index.ts`                       ||
| ` │    │  └─[constant].constant.ts`          | Constant file                                                                                                                                                                                                                                                                      |
| ` │    ├─context/`                           | Context folder                                                                                                                                                                                                                                                                     |
| ` │    │   ├─index.ts`                       ||
| ` │    │   └─[context].context.ts`           | Context file                                                                                                                                                                                                                                                                       |
| ` │    ├─hooks/`                             | Hooks folder                                                                                                                                                                                                                                                                       |
| ` │    │   ├─index.ts`                       ||
| ` │    │   └─[hook].hook.ts`                 | Hook file                                                                                                                                                                                                                                                                          |
| ` │    ├─interfaces/`                        | Hooks folder                                                                                                                                                                                                                                                                       |
| ` │    │   ├─index.ts`                       ||
| ` │    │   └─[interface].interface.ts`       | Hook file                                                                                                                                                                                                                                                                          |
| ` │    ├─pages/`                             | Pages folder                                                                                                                                                                                                                                                                       |
| ` │    │  └─[page]/`                         | Page folder                                                                                                                                                                                                                                                                        |
| ` │    │      ├─[page].page.tsx`             | Page file                                                                                                                                                                                                                                                                          |
| ` │    │      ├─[page].styles.ts`            | Page styles file                                                                                                                                                                                                                                                                   |
| ` │    │      └─[page].types.ts`             | Page typings file                                                                                                                                                                                                                                                                  |
| ` │    ├─services/`                          | Folder to store all services that may contain any logic detached from the global state management                                                                                                                                                                                  |
| ` │    │   ├─index.ts`                       ||
| ` │    │   └─[service].service.ts`           | Service file                                                                                                                                                                                                                                                                       |
| ` │    ├─store/`                             | Folder to save files related to state management                                                                                                                                                                                                                                   |
| ` │    │   ├─[store].slice.ts`               | Slice file                                                                                                                                                                                                                                                                         |
| ` │    │   └─actions/`                       | Actions folder                                                                                                                                                                                                                                                                     |
| ` │    │       └─[action].action.ts`         | Action file                                                                                                                                                                                                                                                                        |
| ` │    └─utils/`                             | Hooks folder                                                                                                                                                                                                                                                                       |
| ` │       ├─index.ts`                        ||
| ` │       └─[util].utils.ts`                 | Hook file                                                                                                                                                                                                                                                                          |
| ` store/`                                    | Folder to save files related to global state management, including rtk-query API definitions                                                                                                                                                                                       |
| ` ├─index.ts`                                | Main file to create and configure a global store root                                                                                                                                                                                                                              |
| ` └─api/`                                    | API folder                                                                                                                                                                                                                                                                         |
| `        ├─index.ts`                         | Main file to create and configure API                                                                                                                                                                                                                                              |
| `        └─[api].api.ts`                     | Api file                                                                                                                                                                                                                                                                           |

