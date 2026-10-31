pub mod export;
pub mod watch;
pub mod search;
pub mod launcher;
pub mod start;
pub mod locate;
pub mod settings;
pub mod commands;

pub mod prdset;

use tauri::{Emitter, Manager};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let first_arg = std::env::args().nth(1).map(std::path::PathBuf::from);
    tauri::Builder::default()
        // A second launch (prdf while the viewer is open) sends its path to this window.
        .plugin(tauri_plugin_single_instance::init(|app, argv, _cwd| {
            let settings = settings::load_settings(&commands::settings_path(app));
            let view = start::start_view(argv.get(1).map(std::path::Path::new), &settings);
            let _ = app.emit("start", view);
            if let Some(w) = app.get_webview_window("main") {
                let _ = w.set_focus();
            }
        }))
        .plugin(tauri_plugin_dialog::init())
        .manage(commands::StartArg(std::sync::Mutex::new(first_arg)))
        .manage(search::SearchState::default())
        .manage(commands::WatchState::default())
        .setup(|_app| {
            // The MCP bridge, only with `--features mcp-bridge`, as in Motion. Its capability is added
            // here and not in capabilities/, so builds without the feature still pass tauri-build.
            // Bound to 127.0.0.1 because it can drive the app.
            #[cfg(feature = "mcp-bridge")]
            {
                _app.handle().add_capability(include_str!("../mcp-bridge.capability.json"))?;
                _app.handle().plugin(tauri_plugin_mcp_bridge::Builder::new().bind_address("127.0.0.1").build())?;
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![commands::open_set, commands::startup, commands::install_prdf, commands::start_for, commands::read_section, commands::item_index, commands::read_asset, commands::export_image, commands::read_grade, commands::backlog, commands::story_links, commands::search, commands::categories, commands::watch_set, commands::reload_set,
            commands::themes,
            commands::save_themes,
            commands::view_prefs,
            commands::save_view_prefs,
            commands::write_export,
            commands::export_pdf,
            commands::print_page])
        .run(tauri::generate_context!())
        .expect("error while running the PRD Forge Viewer");
}
